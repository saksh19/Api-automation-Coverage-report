import express from 'express';
import { insertToDatabase, retrieve,Authentication } from './databaseOperations.js';
import bcrypt from 'bcrypt'
import 'dotenv/config';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import multer from "multer";
import csv from 'csv-parser';
import fs, { access } from 'fs'; 
import axios from 'axios';
import { User } from './models.js';
import { Api } from './models.js';
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer' ;
import { parse } from 'json2csv';

const app = express();
const port = process.env.PORT;
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, '\n');
const jwtSecret = process.env.JWT_SECRET;
const swaggerJSONUrl = "https://uat-cams.wakandi.com/api/swagger/v1/swagger.json";
let swaggerAPIs = [];
const upload = multer({ dest: 'uploads/' });

import crypto from 'crypto'
import { register } from 'module';
import { insertData } from './ApidatabaseOperations.js';
import { error, log } from 'console';


app.use(express.json());
app.use(cors());
app.use(cookieParser())

function signData(data) {
  const sign = crypto.createSign('SHA256');
  sign.update(data);
  sign.end();
  return sign.sign(privateKey, 'base64');
}
async function generateaccessToken (user) {
  return jwt.sign({ id: user.id, email: user.email, user: user.name }, privateKey, { algorithm: 'RS256', expiresIn: '1d' });
}
async function generaterefreshToken (email){
  return jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET, {  expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}

async function generateAccessandRefreshToken(user){
  console.log("user for genertating token",user);
try {
      const accessToken=await generateaccessToken(user)
      const refreshToken=await generaterefreshToken(user.id)
      const User=await Authentication({id:user.id,refreshToken});
        
      return {accessToken,refreshToken}
      
} catch (error) {
  console.log("something went wrong in token generation");
}

}


// <-----------------------------------register route ---------------------------->

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (
    [name,email,password].some((field)=>
      field?.trim()==="")
    )
   {
    return res.status(400).send('All fields are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = JSON.stringify({name, email, password: hashedPassword });
    const signature = signData(userData);
 
    
    const createUser= await insertToDatabase({ name: name.toLowerCase(), email, password: hashedPassword });

    const token = jwt.sign({ userData, signature }, jwtSecret, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal Server Error');
  }
});
// <-----------------------------------register route ---------------------------->


// <------------------------ Login route ----------------------->

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  
  if (!email) {
    return res.sendStatus(400); 
  }

  try {
    const user = await retrieve({ email });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = await generateAccessandRefreshToken(user);
      const { accessToken, refreshToken } = token;
      const { email, name,id } = user;

      const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      };

    
      res.cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .status(200) 
        .json({ message: "User logged in successfully", id,email, name, accessToken, refreshToken });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
});


// <------------------------ Login route ----------------------->

// <---------------------------filter uploded file route--------------------->

app.post("/upload", upload.single('file'), (req, res) => {
  console.log(req.url);
  console.log(">>>>>>>>>>>>>", req.file, "<<<<<<<<<<<<<<<<");
  try {
      if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = req.file.path;
      const endpoints = [];
      const results=[]
      const data={
        endpoints: endpoints,
        results: results
      }

      fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
              endpoints.push(row[Object.keys(row)[0]]);
          })
          .on('end', () => {
              console.log(endpoints);              
          })
          .on('data', (data) => results.push(data))
          .on('end', () => {
            fs.unlinkSync(req.file.path); // Remove the file after processing
            console.log("data is",data);
            res.json(results);
          })
          .on('error', (error) => {
              fs.unlinkSync(filePath); // Remove file on error
              res.status(500).json({ error: "Error parsing CSV file: " + error.message });
          })
          

  } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
  }
});

// <---------------------------filter uploded file route--------------------->

// <------------------------- swagger API fetching route code ------------------------------->

async function fetchSwaggerJSON(url) {
  try {
      const response = await axios.get(url);
      return response.data;
  } catch (error) {
      console.error("Error fetching Swagger JSON:", error);
      throw error;
  }
}

function extractPathsAndMethods(swaggerData) {
  const paths = Object.keys(swaggerData.paths);
  const extractedPathsAndMethods = [];
  for (const path of paths) {
      const methods = Object.keys(swaggerData.paths[path]);
      methods.forEach(method => {
          extractedPathsAndMethods.push({
              path: `/api${path}`,
              method: method.toUpperCase()
          });
      });
  }
  return extractedPathsAndMethods;
}

app.get("/", async (req, res) => {
  console.log(req.url);
  try {
      const swaggerData = await fetchSwaggerJSON(swaggerJSONUrl);
      const extractedPathsAndMethods = extractPathsAndMethods(swaggerData);
      console.log("extracted--------------->", extractedPathsAndMethods);
      
      swaggerAPIs = [];
      extractedPathsAndMethods.forEach((item) => {
          swaggerAPIs.push(item);
      });

      console.log("List of Extracted Paths and Methods:", swaggerAPIs);

      res.status(200).send({
          msg: "Hello",
          data: swaggerAPIs
      });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send({ error: "Internal Server Error" });
  }
});

// <------------------------- swagger API fetching route code ------------------------------->


// <---------------------------Database store route------------------------------------------->
app.post('/store', async (req, res) => {

  console.log("request is",req.body);

  if (!req.body) {
    return res.status(400).send(' Data required');
  }

  try {

    await insertData(req.body);


    res.status(201).json("OK");
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal Server Error');
  }
});

// <-----------------------------Database store route---------------------------------------->



// <------------------------------- user logout route------------------------------------------>

app.post('/logout',async (req,res)=>{
  const user = await User.findOne({email: req.body.email})
  const result=await User.update(
    { refreshToken: null}, 
    { where: { id:user.id } }
  );

 const options={
  httpOnly:true,
  secure:true
 }
 return res
 .status(200)
 .clearCookie('refreshToken',options)
 .clearCookie('accessToken',options)
 .json("successfully logout")

})

// <----------------------------------user logout route------------------------------------------->

app.post('/verifyJWT', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send('Unauthorized request');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized request');
    }

    console.log("Token is", token);

    const decodeToken = jwt.verify(token, privateKey);
    console.log("Decoded Token", decodeToken);

    const user = await User.findByPk(decodeToken?.id, {
      attributes: ['name', 'email', 'createdAt']
    });

    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    console.log("Authenticated user is", user.dataValues);

    req.user = user;
    res.status(200).json({
      user: user.dataValues,
      message: "Authorized"
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(401).send(error.message || 'An error occurred');
  }
});


// const authenticateToken = (req, res, next) => {
//     const token = req.cookies.accessToken || req.headers['authorization']?.replace('Bearer ', '');
  
//     if (!token) {
//       return res.status(401).json({ message: 'Unauthorized request' });
//     }
  
//     jwt.verify(token, privateKey, (err, user) => {
//       if (err) return res.status(403).json({ message: 'Forbidden' });
//       req.user = user;
//       next();
//     });
//   };



// <----------------------------- Invite Route -------------------------->

app.post('/api/invite', async (req, res) => {
  const { email } = req.body;
  console.log("email is",req.body);
  // const inviteCode = generateInviteCode();

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sakshamkhandelwal208@gmail.com',
      pass: 'sjvs vpyu ibcd alik',
    },
  });

  let mailOptions = {
    from: 'sakshamkhandelwal208@gmail.com',
    to: email,
    subject: 'You are invited!',
    text: `You have been invited. Click the link to join: http://yourapp.com/invite/`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Invitation sent!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending invitation.');
  }
});

// <---------------------------------------------invite route ---------------------------------->

app.get('/download-csv',async (req, res) => {

  const {name}=req.query

   const apiArray=await Api.findAll({
    where:{
      Tested_by: name
    }
   })
   const data=apiArray.map(data=>data.dataValues)

  //  const data=apiArray.map(data=> ({ID: data.dataValues.id,
  //   path: data.dataValues.path,
  //   method:data.dataValues.method,
  //   covered:data.dataValues.covered?"true":"false",
  //   created_On:data.dataValues.createdAt
  //   })

   const csv = parse(data);
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=data.csv');
    res.send(csv);
});

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on('SIGINT', async () => {
  console.log('Closing database connection...');
  await sequelize.close();
  console.log('Database connection closed.');
  server.close(() => {
    console.log('Server shut down.');
    process.exit(0);
  });
});
