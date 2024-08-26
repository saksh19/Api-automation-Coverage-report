import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from './Uplform';
import { toast,ToastContainer } from 'react-toastify';

function Account() {
  const [currentUser, setCurrentUser] = useState(null);
  const [email,setEmail] = useState("")
  const navigate = useNavigate();


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
         }

        const response = await axios.post(
          `${BACKEND_URL}/verifyJWT`,
          {},
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        setCurrentUser(response.data.user);

      }
       catch (error) 
      {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    
    try {
      await axios.post(`${BACKEND_URL}/logout`);
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
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

  

  if (currentUser === null) {
    return <div>Loading...</div>; 
  }

const date =moment(currentUser.createdAt)


  return (
    <div className='container px-3 py-2'>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text-gray-900">Account details</h3>
        </div>
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Full name</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {currentUser.name || 'N/A'}
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Email address</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {currentUser.email || 'N/A'}
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">About</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {`Created on: ${date.format('YYYY-MM-DD')}` ||'N/A'}
              </dd>
            </div>

            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">Attachments</dt>
              <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
              <div className="flex w-0 flex-1 items-center">
                <svg className="h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
                </svg>
                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                  <span className="truncate font-medium">All tested Api</span>
                  <span className="flex-shrink-0 text-gray-400"></span>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <a  href={`http://localhost:5000/download-csv?name=${encodeURIComponent(currentUser.name).toLowerCase()}`} download="data.csv" className="font-medium text-indigo-600 hover:text-indigo-500">Download</a>
              </div>
            </li>
                </ul>
              </dd>
            </div>
<div className="input-container m-auto ">
  <input required="" placeholder="Email Address" type="email"  value={email}  onChange={(e)=>setEmail(e.target.value)}/>
  <button className="invite-btn" type="button" onClick={handleInvite} >
    Invite
  </button>
</div>
          </dl>
          <div className='px-4 py-4'>
            <button className="Btn" onClick={logout}>
              <div className="sign">
                <svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg>
              </div>
              <div className="text">Logout</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
