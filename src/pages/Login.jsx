import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import './Login.css';

function Login() {
  const [currState, setCurrState] = useState("Login");
  const { login, setIsLoading } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    // We will hook this up to the real backend later
    try {
      /*
      let newUrl = "/api/login";
      if (currState === "Signup") newUrl = "/api/signup";
      const response = await axios.post(newUrl, data);
      
      if (response.data.success) {
        login(response.data.token, response.data.user);
        toast.success(currState === "Login" ? "Logged in successfully" : "Signup successful");
        navigate('/');
      } else {
        toast.error(response.data.message || "Error occurred");
      }
      */
      
      // Mock login for now
      setTimeout(() => {
        setIsLoading(false);
        login('mock-token-123', { username: data.username || "Seller" });
        toast.success(`${currState} successful!`);
        navigate('/');
      }, 1000);
      
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || `Error during ${currState}`);
    }
  };

  return (
    <div className="login-body-information">
      <div className="collab-image-box">
        <img src="/assets/alan-collab.jpg" alt="alan-collab" />
      </div>
      <div className="information">
        
        {currState === "Login" ? (
          <div className="login-box" style={{ display: 'block' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div><p style={{ fontSize: '25px' }}>Login</p></div>
                <div><p style={{ color: 'grey', fontSize: '20px' }}>Login to resume your journey.</p></div>
              </div>

              <form onSubmit={onLogin} className="input-holder" style={{ gap: '20px' }}>
                <input name="username" type="text" placeholder="UserName" value={data.username} onChange={onChangeHandler} required />
                <input name="password" type="password" placeholder="Password" value={data.password} onChange={onChangeHandler} required />
                <button className="login-button" type="submit">Login</button>
              </form>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginTop: '50px', alignItems: 'center' }}>
              <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
              <p>OR</p>
              <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
            </div>
            
            <div style={{ marginTop: '40px' }}>
              <button 
                type="button" 
                className="login-button in-login-signup-button" 
                onClick={() => setCurrState("Signup")}
              >
                Signup
              </button>
            </div>
          </div>
        ) : (
          <div className="signup-box" style={{ display: 'block' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div><p style={{ fontSize: '25px' }}>Signup</p></div>
                <div><p style={{ color: 'grey', fontSize: '20px' }}>Signup to start your journey.</p></div>
              </div>

              <h3 style={{ color: '#ee053b', fontFamily: '"League Spartan", sans-serif' }}>Notice: UserName will be used as Brand Name</h3>
              
              <form onSubmit={onLogin} className="input-holder" style={{ gap: '20px' }}>
                <input name="username" type="text" placeholder="UserName" value={data.username} onChange={onChangeHandler} required />
                <input name="email" type="email" placeholder="Email" value={data.email} onChange={onChangeHandler} required />
                <input name="password" type="password" placeholder="Password" value={data.password} onChange={onChangeHandler} required />
                <button className="signup-button" type="submit">Signup</button>
              </form>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginTop: '50px', alignItems: 'center' }}>
              <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
              <p>OR</p>
              <hr style={{ height: '0.5px', width: '14.3vw', borderStyle: 'solid', marginTop: '4px', backgroundColor: 'black' }} />
            </div>

            <div style={{ marginTop: '40px' }}>
              <button 
                type="button" 
                className="login-button in-signup-login-button" 
                onClick={() => setCurrState("Login")}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
