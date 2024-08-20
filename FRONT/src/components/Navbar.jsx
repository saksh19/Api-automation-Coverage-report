import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

function Navbar({handleOpenForm,handleOpenInvite}) {
  const [uploadBtn,setUploadBtn]=useState(true)
  const navigate=useNavigate()


  return (
    <nav  className='tab-container flex'>
      <div className="flex -space-x-2 overflow-hidden px-2 mt-1 border">
      <Link to="Account"onClick={()=>{setUploadBtn(false)}}><img className="inline-block h-11 w-11   ring-2 ring-white" src="https://i.pinimg.com/564x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg" alt=""/></Link>
      </div>
<div className="tab-container mt-2">
  <div onClick={()=>{
     navigate("")
     setUploadBtn(true)
   }} >
  <input type="radio" name="tab" id="tab1" className="tab tab--1" />
  <label className="tab_label m-auto" htmlFor="tab1" >Dashboard</label>
  </div>
  <input type="radio" name="tab" id="tab2" className="tab tab--2" />
  <label className="tab_label" htmlFor="tab2">Settings</label>

  <input type="radio" name="tab" id="tab3" className="tab tab--3" />
  <label className="tab_label" htmlFor="tab3"></label>
  <h3 classnamename='m-1 h-6 ml-auto  flex items-end px-4 justify-end text-black font-bold rounded-md' >Cams Api automation Coverage report</h3>
  <div className="indicator"></div>
</div>
{uploadBtn && <div className='flex justify-end ml-auto px-2 py-2'>
<button
  className="rounded-lg relative w-48 h-10 cursor-pointer flex items-center border border-gray-800  bg-gray-700 group hover:bg-gray-800 active:bg-gray-800 active:border-gray-800 "
 onClick={handleOpenForm}>
  <span
    className="text-gray-200 font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300"
    >Upload file</span
  >
  <span
    className="absolute right-0 h-full w-10 rounded-lg bg-gray-700 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300"
  >
    <svg
      className="svg w-8 text-white"
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap ="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="12" x2="12" y1="5" y2="19"></line>
      <line x1="5" x2="19" y1="12" y2="12"></line>
    </svg>
  </span>
</button>
<button
  className="rounded-lg w-20 text-center h-10  items-center text-white   border border-gray-800  bg-gray-700  hover:bg-gray-800 active:bg-gray-800 active:border-gray-800 ml-20"
 onClick={handleOpenInvite}>
  invite
 </button>
</div>}
    </nav>
    

  )
}

export default Navbar
