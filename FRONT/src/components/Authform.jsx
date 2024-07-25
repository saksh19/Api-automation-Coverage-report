import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Home from './Home';
import Account from './Account';
function Authform() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const [verify,setVerify]=useState(false)

  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      setToken(response.data.token);
      console.log('Login successful', response.data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleClick = () => {
   token && navigate('/Account')
  };

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

  const ProtectedRoute = ({ component: Component, ...rest }) => {
    const [isAuth, setIsAuth] = React.useState(null);
  
    React.useEffect(() => {
      const checkAuth = async () => {
        const authenticated = await isAuthenticated();
        setIsAuth(authenticated);
      };
      checkAuth();
    }, []);
  
    if (isAuth === null) {
      return <div>Loading...</div>;
    }
  
    return (      <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute component={Home} />}>
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </Router>
    )}

  return (
    <div className='containeracc'>
  <div className="relative z-0 flex flex-col min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
    <div className="p-6 mb-0 text-center bg-white border-b-0 rounded-t-2xl">
      <h5>welcome</h5>
    </div>
    <div className="flex-auto p-6">
      <form role="form text-left" onSubmit={handleLogin}>
        <div className="mb-4">
          <input
            aria-describedby="Email-addon"
            aria-label="Email"
            placeholder="Email"
            className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            aria-describedby="password-addon"
            aria-label="Password"
            placeholder="Password"
            className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            // checked={agreed}
            // onChange={handleCheckboxChange}
            type="checkbox"
            className="w-5 h-5 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
            id="terms"
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-700 cursor-pointer">
            I agree to the <a to="/terms" className="font-bold text-fuchsia-600">Terms and Conditions</a>
          </label>
        </div>
        <div className="text-center">
          <button
            className="w-full px-6 py-3 mt-6 mb-2 font-bold text-white uppercase transition-all bg-gradient-to-tl from-gray-900 to-slate-800 rounded-lg shadow-soft-md hover:from-slate-800 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50"
            type="button"
            // disabled={!agreed}
          >
           Log in
          </button>
        </div>
        <p className="mt-4 mb-0 text-sm text-center text-gray-700">
          Don't have an account? <a to="/signup" className="font-bold text-fuchsia-600"><Link to='register'>Sign up</Link></a>
        </p>
      </form>
    </div>
  </div>
</div>
  );
}

export default Authform
