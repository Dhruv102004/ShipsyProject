
import React from 'react';
import Register from '../components/auth/Register';

const RegisterPage = () => {
  return (
    <div style={styles.container}>
      <Register />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to right, #ece9e6, #ffffff)',
  },
};

export default RegisterPage;

