import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Authform from './components/Authform.jsx';
import Registerform from './components/Registerform.jsx';
import Home from './components/Home.jsx';
import Account from './components/Account.jsx';
import Uploadform from './components/Upltest2.jsx';
import PrivateRoute from './components/PrivateRoute.jsx'; // Import PrivateRoute
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}> {/* Main layout or root component */}
      <Route index element={<Authform />} />
      <Route path="/register" element={<Registerform />} />
      <Route path="/home" element={<PrivateRoute />}> {/* Protect Home route */}
        <Route index element={<Home />} />
        <Route path="upload" element={<Uploadform />} />
        <Route path="account" element={<Account />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
