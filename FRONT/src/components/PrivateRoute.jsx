import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, Navigate } from 'react-router-dom';
import axios from 'axios';

const checkAuth = async () => {
  try {
    const token = localStorage.getItem("token");
    console.log("Token retrieved:", token);

    if (!token) {
      return false;
    }

    const response = await axios.post(
      "http://localhost:5000/verifyJWT",
      {},
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    console.log("response ststus is",response);

    return response.status === 200;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      console.log("authstatus",authStatus);
      setIsAuthenticated(authStatus);
      if (!authStatus) {
        navigate("/", { replace: true });
      }
    };

    verifyAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // or a more sophisticated loading indicator
  }
  console.log("is AUTHENTICATED",isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
