import React from 'react'
import { useState,useEffect } from 'react';
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
// let navigate = useNavigate()
let authenticated= null;
const isAuthenticated = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return false;
  }

  try {
    const response = await axios.post('http://localhost:5000/verify-token', { token });
    return response.data.isValid;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};



function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [inviteOpen,setInviteOpen] = useState(false);
 

 const handleOpenInvite = () => {
      setInviteOpen(inviteOpen?false:true)
 }

  const handleOpenForm = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Navbar handleOpenForm={handleOpenForm} handleOpenInvite={handleOpenInvite}/>
      <div>
        <Outlet context={{ isOpen, handleOpenForm, inviteOpen,handleOpenInvite }} />
      </div>
    </>
  );
}

export default Home;

