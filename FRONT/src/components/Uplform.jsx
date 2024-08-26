import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BACKEND_URL = 'http://localhost:5000';


function Uploadform() {
  const context = useOutletContext() || {}
  const { isOpen, handleOpenForm,inviteOpen,handleOpenInvite} = context
  const [file, setFile] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [coverageStats, setCoverageStats] = useState({ covered: 0, notCovered: 0 });
  const [coveredApiEndpoints, setCoveredApiEndpoints] = useState([]);
  const [coverageList, setCoverageList] = useState([]);
  const [name, setName] = useState("");
  const [testcase, setTestCase] = useState("");
  const [result, setResult] = useState([]);
  const [isOpened, setIsOpened] = useState(false);
  const [formError, setFormError] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [date,setDate]=useState("");
  const [show,setShow]=useState(false);
  const [email,setEmail] = useState("");


  const options = {
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: true,
      },
    },
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("File is required");
      return;
    }
    setFormError(false);
    const formData = new FormData();
    formData.append('file', file);
    handleOpenForm();
    setFile(null);
    try {
      const res = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const formattedEndpoints = res.data.map(data => data.Label.split('------')[0]);
      setEndpoints(formattedEndpoints);
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleInvite=async ()=>{
    try {
      const res=await axios.post(`${BACKEND_URL}/api/invite`,{email})
      toast.success(res.data,{
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setEmail("")

    } catch (error) {
      console.log(`invite error: ${error}`);
      toast.error("Invalid Email!",{
        autoClose: 3000, 
        hideProgressBar: false, 
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { color: "black"},
      });
    }
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const swag = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/`);
      let CAMS = data.data;
      setShow(true)
      const listData =  await updateCoverageList(CAMS, endpoints);
      const updatedlist= listData.map(list=>({
        ...list,
        tested_by: name.toLowerCase(),
        test_name: testcase
      }))
      const store= await axios.post(`${BACKEND_URL}/store`,updatedlist);
      console.log("store",store)
    } catch (error) {
      console.log("error", error);
    }
  };

  const updateCoverageList = async (apis, endpoints) => {
    const coverageList = apis.map(api => ({
      ...api,
      covered: endpoints.includes(api.path),
    }));

    coverageList.sort((a, b) => b.covered - a.covered); 
    const list = coverageList.filter(api => api.covered);
    setCoverageList(coverageList);
    const covered = coverageList.filter(api => api.covered).length;
    const notCovered = coverageList.length - covered;
    setCoverageStats({ covered, notCovered });
    return list;
  };

  const percentages = {
    category1: (coverageStats.covered / coverageList.length) * 100,
    category2: (coverageStats.notCovered / coverageList.length) * 100,
  };

  const chartdata = {
    labels: ['Covered', 'Not Covered'],
    datasets: [
      {
        label: '% of APIs',
        data: [percentages.category1, percentages.category2],
        backgroundColor: ['rgba(20, 121, 30, 0.5)', 'rgba(209, 59, 25, 0.5)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className={`relative ${isOpen ? 'blur-background' : ''}`}>
        {isOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 containerup">
            <form className="bg-white p-6 rounded shadow-lg transition-transform transform scale-100 slider card" onSubmit={handleSubmit}>
              <button className="btn-close" onClick={handleOpenForm}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0V0z"></path>
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                    fill="var(--c-text-secondary)"
                  ></path>
                </svg>
              </button>

              <h2 className="text-2xl mb-0">Upload Form</h2>

              <div className="inputBox1 gap-2">
                <input type="text" id="name" name="name" required onChange={(e) => { setName(e.target.value) }} />
                <span className="user">Name</span>
              </div>
               <div className="inputBox gap-2">
                <input type="text" required onChange={(e)=>{setTestCase(e.target.value)}} />
                <span>Test Name</span>
              </div>
              <div className="inputBox gap-2">
                <input type="date" required onChange={(e)=>{setDate(e.target.value)}}/>
              </div>
              

              <div className="file-upload-form">
                <label htmlFor="file" className="file-upload-label">
                  <div className="file-upload-design">
                    {!file && <svg viewBox="0 0 640 512" height="1em">
                      <path
                        d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z"
                      ></path>
                    </svg>}
                    {!file && <> <p>Drag and Drop</p>
                      <p>or</p></>}
                    <span className="browse-button">{file ? file.name : "Browse file"}</span>
                  </div>
                  <input id="file" type="file" onChange={(e) => { setFile(e.target.files[0]) }} />
                </label>
              </div>
              <button type="submit" className="enter">Enter</button>
            </form>
          </div>
        )}
       {inviteOpen && <>
       <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 containerup">
                <div className="input-container m-auto ">
        <input required="" placeholder="Email Address" type="email"  value={email}  onChange={(e)=>setEmail(e.target.value)}/>
        <button className="invite-btn" type="button" onClick={handleInvite} >
          Invite
         </button>
         </div>
         <div className=''>
       <button className="btn-close" onClick={handleOpenInvite} >
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                   <path fill="none" d="M0 0h24v24H0V0z"></path>
                   <path
                     d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                     fill="var(--c-text-secondary)"
                   ></path>
                 </svg>
               </button>
               </div>
          </div></>}

        <div className='bg-white-200 flex justify-evenly'>
          <div className='h-[400px] border-white'>
            <h3 className='text-center bg-slate-200 font-semibold'>Api Performance Test Coverage</h3>
            <Pie data={chartdata} options={options} />
          </div>
        </div>

        <div className='relative bg-slate-200 p-4 flex justify-around'>
           <h1 className='font-semibold text-xl mt-3 mr-auto'> Total Uploaded Endpoints: {endpoints.length}</h1>
          <h3 className='absolute left-1/2 transform -translate-x-1/2 font-semibold text-xl mt-3'>Uploaded API Endpoints: {file ? file.name : ""}</h3>
          <div className='flex justify-end'>
           
          </div>
          <button className='rounded-md px-2 py-2 m- bg-blue-600 h-12 text-white mr-14' onClick={swag}>Click to test</button>
        </div>

        <div className='h-[400px] bg-white-200 overflow-scroll'>
          <ul>
            {endpoints.map((endpoint, index) => (
              <li className='p-2 m-2 bg-slate-200 pl-4 rounded-md border border-white' key={index}>{endpoint}</li>
            ))}
          </ul>
        </div>

        <div className='relative bg-slate-200 p-4 flex '>
        {show && <div className='mr-auto flex-col'>
          <h3 className='mr-auto'><strong>Executed by:</strong> {name}</h3>
          <h3><strong>Date:</strong> {date} </h3>
          <h3><strong>Test Name:</strong>{testcase}</h3>
          </div>}
          <h3 className='absolute left-1/2 transform -translate-x-1/2 font-semibold text-xl'>API List with Coverage Status:</h3>
          <div className='flex justify-end'>
            <h1 className='font-semibold text-xl'>covered: {coverageStats.covered} Uncovered: {coverageStats.notCovered}</h1>
          </div>
        </div>

        <div className='h-[400px] bg-white overflow-scroll m-2'>
          {coverageList.map((api, index) => {
            const matchedResult = result.find(r => r.Label.split('------')[0] === api.path);
            return (
              <div key={index}>
                <h2>
                  <button
                    type="button"
                    className={`flex items-center justify-between w-full p-5 font-medium text-black border border-b-3 ${api.covered ? 'bg-green-200' : 'bg-red-200'} py-3 border-slate-600 rounded-lg m-2 p-2`}
                    onClick={() => toggleDropdown(index)}
                    aria-expanded={openIndex === index}
                    aria-controls={`accordion-collapse-body-${index}`}
                  >
                    <div className={`p-2 m-2 flex`}>
                      <p className='w-[60vw] text-left'><strong>Path:</strong> {api.path}</p>
                      <p className='text-left w-52'><strong>Method:</strong> {api.method}</p>
                      <p className='text-right'><strong>Covered:</strong> {api.covered ? 'Yes' : 'No'}</p>
                    </div>
                   {api.covered && <svg
                      className={`w-3 h-3 ${openIndex === index ? 'rotate-180' : ''} shrink-0`}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6"
                    >
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                    </svg>}
                  </button>
                </h2>
               {api.covered &&
                <div
                  id={`accordion-collapse-body-${index}`}
                  className={`p-5 border border-b-0 border-gray-200 ${openIndex === index ? '' : 'hidden'} `}
                  aria-labelledby={`accordion-collapse-heading-${index}`}
                >
                    <div className="flex justify-around">
                    <div>
                    <p className="mb-2 text-black"><strong>Average: </strong>{matchedResult.Average}</p>
                  <p className="mb-2 text-black"><strong>Max: </strong>{matchedResult.Max}</p>
                  <p className="mb-2 text-black"><strong>Min: </strong>{matchedResult.Min}</p>
                  </div>
                  <p className="mb-2 text-black"><strong>Error %: </strong>{matchedResult['Error %']}</p>
                  <p className="mb-2 text-black"><strong>Throughput: </strong>{matchedResult.Throughput}</p>
                  </div>

                </div>}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Uploadform;
export {BACKEND_URL}