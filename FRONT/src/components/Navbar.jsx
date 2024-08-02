import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
// import { handleOpenForm } from './Uploadform';

function Navbar({handleOpenForm}) {
  const navigate=useNavigate()

   const upload=()=>{
     navigate("")
   }

  return (
    <nav  className='tab-container flex'>
      <div class="flex -space-x-2 overflow-hidden px-2  mt-1 ">
      <Link to="Account"><img class="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/></Link>
</div>
<div class="tab-container mt-2">
  <div onClick={upload} >
  <input type="radio" name="tab" id="tab1" class="tab tab--1" />
  <label class="tab_label m-auto" for="tab1" >Coverage Test</label>
  </div>
  <input type="radio" name="tab" id="tab2" class="tab tab--2" />
  <label class="tab_label" for="tab2">Settings</label>

  <input type="radio" name="tab" id="tab3" class="tab tab--3" />
  <label class="tab_label" for="tab3"></label>
  <h3 className='m-1 h-6 ml-auto  flex items-end px-4 justify-end text-black font-bold rounded-md' >Cams Api automation Coverage report</h3>
  <div class="indicator"></div>
</div>
<div className='justify-end ml-auto px-2 py-2'>
<button
  class="rounded-lg relative w-48 h-10 cursor-pointer flex items-center border border-gray-800  bg-gray-700 group hover:bg-gray-800 active:bg-gray-800 active:border-gray-800 ml-20"
 onClick={handleOpenForm}>
  <span
    class="text-gray-200 font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300"
    >Upload file</span
  >
  <span
    class="absolute right-0 h-full w-10 rounded-lg bg-gray-700 flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300"
  >
    <svg
      class="svg w-8 text-white"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="12" x2="12" y1="5" y2="19"></line>
      <line x1="5" x2="19" y1="12" y2="12"></line>
    </svg>
  </span>
</button>
</div>
    </nav>
    

  )
}

export default Navbar
