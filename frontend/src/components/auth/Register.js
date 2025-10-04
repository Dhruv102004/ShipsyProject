
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isSeller: false,
  });
  const navigate = useNavigate();

  const { name, email, password, isSeller } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCheckboxChange = (e) => {
    setFormData({ ...formData, isSeller: e.target.checked });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', formData);
      console.log(res.data);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      if (err.response) {
        alert(err.response.data.message);
        if (err.response.data.message === 'User already exists') {
          navigate('/login');
        }
      } else {
        alert('Something went wrong');
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={onChange}
        required
      />
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
      <label>
        <input
          type="checkbox"
          name="isSeller"
          checked={isSeller}
          onChange={onCheckboxChange}
        />
        Register as a seller
      </label>
      <input type="submit" value="Register" />
    </form>
  );
};

export default Register;
