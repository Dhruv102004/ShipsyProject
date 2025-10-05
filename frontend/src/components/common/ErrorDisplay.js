import React from 'react';

const ErrorDisplay = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={styles.container}>
      <p style={styles.message}>{message}</p>
      <button onClick={onClose} style={styles.closeButton}>×</button>
    </div>
  );
};

const styles = {
  container: {
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#721c24',
  },
};

export default ErrorDisplay;
