import React from 'react';

const SuccessDisplay = ({ message, onClose }) => {
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
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
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
    color: '#155724',
  },
};

export default SuccessDisplay;
