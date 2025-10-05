
import React from 'react';
import Login from '../components/auth/Login';

const LoginPage = () => {
  return (
    <div style={styles.container}>
      <Login />
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

export default LoginPage;


