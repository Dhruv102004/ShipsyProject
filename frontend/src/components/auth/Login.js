
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Label, TextInput, Checkbox } from 'flowbite-react';


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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="text-center mb-6">
            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <Label htmlFor="email" value="Email address" />
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={onChange}
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  value={password}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="ml-2">Remember me</Label>
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
