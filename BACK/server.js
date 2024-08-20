// import express from 'express';
// import { insertToDatabase, retrieve,Authentication } from './databaseOperations.js';
// import bcrypt from 'bcrypt'
// import 'dotenv/config';
// import cors from 'cors';
// import jwt from 'jsonwebtoken';
// import multer from "multer";
// import csv from 'csv-parser';
// import fs, { access } from 'fs'; 
// import axios from 'axios';
// import { User } from './models.js';


// const app = express();
// const port = process.env.PORT;
// const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
// const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, '\n');
// const jwtSecret = process.env.JWT_SECRET;
// const swaggerJSONUrl = "https://uat-cams.wakandi.com/api/swagger/v1/swagger.json";
// let swaggerAPIs = [];
// const upload = multer({ dest: 'uploads/' });

// import crypto from 'crypto'
// import { register } from 'module';
// import { insertData } from './ApidatabaseOperations.js';
// import { error, log } from 'console';


// app.use(express.json());
// app.use(cors());
// // app.use(cookieParser)

// function signData(data) {
//   const sign = crypto.createSign('SHA256');
//   sign.update(data);
//   sign.end();
//   return sign.sign(privateKey, 'base64');
// }
// async function generateaccessToken (user) {
//   return jwt.sign({ id: user.id, email: user.email, user: user.name }, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
// }
// async function generaterefreshToken (email){
//   return jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET, {  expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
// }

// async function generateAccessandRefreshToken(user){
//   console.log("user for genertating token",user);
// try {
//       const accessToken=await generateaccessToken(user)
//       console.log("accessToken",accessToken);
//       const refreshToken=await generaterefreshToken(user.id)
//       console.log("refreshToken",refreshToken)
//       const User=await Authentication({id:user.id,refreshToken});
//       console.log("user from authen",User);
        
//       return {accessToken,refreshToken}
      
// } catch (error) {
//   console.log("something went wrong in token generation");
// }

// }


// // <-----------------------------------register route ---------------------------->

// app.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;
//   if (
//     [name,email,password].some((field)=>
//       field?.trim()==="")
//     )
//    {
//     return res.status(400).send('All fields are required');
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userData = JSON.stringify({name, email, password: hashedPassword });
//     const signature = signData(userData);
 
    
//     const createUser= await insertToDatabase({ name: name.toLowerCase(), email, password: hashedPassword });
//     console.log("create user info",createUser.errors,"<<<<<<<<<")
//     // Generate JWT token
//     const token = jwt.sign({ userData, signature }, jwtSecret, { expiresIn: '1h' });

//     res.status(201).json({ token });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });
// // <-----------------------------------register route ---------------------------->


// // <------------------------ Login route ----------------------->

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   if(!email){
//     res.sendStatus(404)
//   }
//   try {
//     const user = await retrieve({email});
//     console.log("user from db",user)

//     if (user && await bcrypt.compare(password, user.password)) {
//      const token= await generateAccessandRefreshToken(user)
//      const {accessToken,refreshToken}=token
//      console.log("tokens are",token);
//      const {email,name}= user

//      const options={
//       httpOnly: true,
//       secure: true
//     }
//     res.cookie("accessToken", accessToken, options)
//     .cookie("refreshToken", refreshToken, options)
//     .status(200) // Use 200 or another valid status code
//     .json({ message: "User logged in successfully", email, name,accessToken, refreshToken });
//     } else {
//       res.status(401).send('Invalid credentials');
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // <------------------------ Login route ----------------------->

// // <---------------------------filter uploded file route--------------------->

// app.post("/upload", upload.single('file'), (req, res) => {
//   console.log(req.url);
//   console.log(">>>>>>>>>>>>>", req.file, "<<<<<<<<<<<<<<<<");
//   try {
//       if (!req.file) {
//           return res.status(400).json({ error: "No file uploaded" });
//       }

//       const filePath = req.file.path;
//       const endpoints = [];
//       const results=[]
//       const data={
//         endpoints: endpoints,
//         results: results
//       }

//       fs.createReadStream(filePath)
//           .pipe(csv())
//           .on('data', (row) => {
//               endpoints.push(row[Object.keys(row)[0]]);
//           })
//           .on('end', () => {
//               console.log(endpoints);              
//           })
//           .on('data', (data) => results.push(data))
//           .on('end', () => {
//             fs.unlinkSync(req.file.path); // Remove the file after processing
//             console.log("data is",data);
//             res.json(results);
//           })
//           .on('error', (error) => {
//               fs.unlinkSync(filePath); // Remove file on error
//               res.status(500).json({ error: "Error parsing CSV file: " + error.message });
//           })
          

//   } catch (error) {
//       console.log(error);
//       res.status(500).send({ error: "Internal Server Error" });
//   }
// });

// // <---------------------------filter uploded file route--------------------->

// // <------------------------- swagger API fetching route code ------------------------------->

// async function fetchSwaggerJSON(url) {
//   try {
//       const response = await axios.get(url);
//       return response.data;
//   } catch (error) {
//       console.error("Error fetching Swagger JSON:", error);
//       throw error;
//   }
// }

// function extractPathsAndMethods(swaggerData) {
//   const paths = Object.keys(swaggerData.paths);
//   const extractedPathsAndMethods = [];
//   for (const path of paths) {
//       const methods = Object.keys(swaggerData.paths[path]);
//       methods.forEach(method => {
//           extractedPathsAndMethods.push({
//               path: `/api${path}`,
//               method: method.toUpperCase()
//           });
//       });
//   }
//   return extractedPathsAndMethods;
// }

// app.get("/", async (req, res) => {
//   console.log(req.url);
//   try {
//       const swaggerData = await fetchSwaggerJSON(swaggerJSONUrl);
//       const extractedPathsAndMethods = extractPathsAndMethods(swaggerData);
//       console.log("extracted--------------->", extractedPathsAndMethods);
      
//       swaggerAPIs = [];
//       extractedPathsAndMethods.forEach((item) => {
//           swaggerAPIs.push(item);
//       });

//       console.log("List of Extracted Paths and Methods:", swaggerAPIs);

//       res.status(200).send({
//           msg: "Hello",
//           data: swaggerAPIs
//       });
//   } catch (error) {
//       console.error("Error:", error);
//       res.status(500).send({ error: "Internal Server Error" });
//   }
// });

// // <------------------------- swagger API fetching route code ------------------------------->


// // <---------------------------Database store route------------------------------------------->
// app.post('/store', async (req, res) => {

//   console.log("request is",req.body);

//   if (!req.body) {
//     return res.status(400).send(' Data required');
//   }

//   try {

//     await insertData(req.body);


//     res.status(201).json("OK Boss");
//   } catch (error) {
//     console.error('Error during registration:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // <-----------------------------Database store route---------------------------------------->



// // <------------------------------- user logout route------------------------------------------>

// app.post('/logout',async (req,res)=>{
//   const user = await User.findOne({email: req.body.email})
//   const result=await User.update(
//     { refreshToken: null}, 
//     { where: { id:user.id } }
//   );

//  const options={
//   httpOnly:true,
//   secure:true
//  }
//  return res
//  .status(200)
//  .clearCookie('refreshToken',options)
//  .clearCookie('accessToken',options)
//  .json("successfully logout")

// })

// // <----------------------------------user logout route------------------------------------------->

// app.post('/verifyJWT',async (req,res)=>{
// try {
//      const Token= req.cookies?.accessToken || req.header
//      ("Authorization")?.replace("bearer","")  
  
//      if(!Token){
//       throw new error(401,"Unauthorized request")
//      } 
//      const decodeToken=  
//      jwt.verify(Token,process.env.JWT_SECRET)
  
//     const user= await User.findByPk(decodeToken?.id, {
//       attributes: ['name', 'email'] 
//     });
  
//     if (!user) {
//       res.send("unauthorized")
//     }
//     req.user=user
// } catch (error) {
//   res.send(error)
// }
// })



// const server = app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

// process.on('SIGINT', async () => {
//   console.log('Closing database connection...');
//   await sequelize.close();
//   console.log('Database connection closed.');
//   server.close(() => {
//     console.log('Server shut down.');
//     process.exit(0);
//   });
// });
