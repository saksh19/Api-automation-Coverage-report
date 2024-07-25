import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Authform from './components/Authform.jsx'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Home from './components/Home.jsx'
import Account from './components/Account.jsx'
import Registerform from './components/Registerform.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" >
       <Route path="/" element={<Authform/>}> </Route>
       <Route path='/register' element={<Registerform/>}></Route>
       <Route path="/Home" element={<Home/>}>
         <Route path='/Home/Account' element={<Account/>}></Route>
         <Route></Route>
       </Route>
    </Route>
  ))

ReactDOM.createRoot(document.getElementById('root')).render(
<RouterProvider router={router} />
)
