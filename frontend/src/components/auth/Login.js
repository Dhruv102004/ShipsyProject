
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request and expect a token in response
      const res = await axios.post('http://localhost:3001/api/auth/login', formData);

      if (!res || !res.data) throw new Error('Invalid response from server');

      const token = res.data.token;
      if (!token) throw new Error('Login did not return a token');

      // Persist token for subsequent requests
      localStorage.setItem('token', token);

      // Fetch the full user profile to obtain isSeller
      let user = null;
      try {
        const meRes = await axios.get('http://localhost:3001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        user = meRes.data;
      } catch (meErr) {
        // Fall back to any user object returned by the login endpoint
        console.warn('Failed to fetch /api/auth/me, falling back to login response', meErr);
        user = res.data.user || res.data;
      }

      if (!user) throw new Error('Unable to determine user after login');

      // Ensure isSeller exists
      if (typeof user.isSeller === 'undefined') user.isSeller = false;

      // Persist user
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate to unified dashboard. App will render appropriate dashboard using stored user
      console.log('Logged in user isSeller:', user.isSeller);
      if(user.isSeller){
        navigate('/seller-dashboard')
      }
      else{
        navigate('/buyer-dashboard')
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert('Something went wrong');
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="Email Address"
        name="email"
        value={email}
        onChange={onChange}
        required
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={password}
        onChange={onChange}
        minLength="6"
        required
      />
      <input type="submit" value="Login" />
    </form>
  );
};

export default Login;
