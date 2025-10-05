
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorDisplay from '../common/ErrorDisplay';
import SuccessDisplay from '../common/SuccessDisplay';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isSeller: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const { name, email, password, isSeller } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(null);
  };

  const onCheckboxChange = (e) => {
    setFormData({ ...formData, isSeller: e.target.checked });
    setError(null);
    setSuccess(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', formData);
      console.log(res.data);
      setSuccess('Registration successful! Please login.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create an Account</h2>
        <form onSubmit={onSubmit} style={styles.form}>
          <ErrorDisplay message={error} onClose={() => setError(null)} />
          <SuccessDisplay message={success} onClose={() => setSuccess(null)} />
          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={onChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={onChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              required
              minLength={6}
              value={password}
              onChange={onChange}
              style={styles.input}
            />
          </div>
          <div style={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="isSeller"
              name="isSeller"
              checked={isSeller}
              onChange={onCheckboxChange}
              style={styles.checkbox}
            />
            <label htmlFor="isSeller" style={styles.checkboxLabel}>Register as a seller</label>
          </div>
          <button type="submit" style={styles.button}>
            Register
          </button>
          <div style={styles.footer}>
            <p>Already have an account?{' '}
              <button type="button" style={styles.linkButton} onClick={() => navigate('/login')}>
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '400px',
    padding: '40px',
    borderRadius: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#777',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#555',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
  },
  checkbox: {
    marginRight: '10px',
  },
  checkboxLabel: {
    color: '#555',
    fontSize: '14px',
  },
  button: {
    padding: '15px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s ease-in-out',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#777',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#007bff',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: 0,
    marginLeft: '5px',
  },
};

export default Register;

