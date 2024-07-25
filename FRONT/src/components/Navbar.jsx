import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav  className='tab-container flex'>
      <div class="flex -space-x-2 overflow-hidden px-2">
      <Link to="Account"><img class="inline-block h-10 w-10 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/></Link>
</div>
<div class="tab-container">
  <input type="radio" name="tab" id="tab1" class="tab tab--1" />
  <label class="tab_label" for="tab1">Coverage Test</label>

  <input type="radio" name="tab" id="tab2" class="tab tab--2" />
  <label class="tab_label" for="tab2">Settings</label>

  <input type="radio" name="tab" id="tab3" class="tab tab--3" />
  <label class="tab_label" for="tab3"></label>
  <h3 className='m-1 h-6 ml-auto  flex items-end px-4 justify-end text-black font-bold rounded-md' >Cams Api automation Coverage report</h3>
  <div class="indicator"></div>
</div>
    </nav>
    

  )
}

export default Navbar
