
import React from 'react';
import ProductList from '../components/seller/ProductList';
import Header from '../components/common/Header';

const SellerDashboard = () => {
  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>Seller Dashboard</h1>
        <ProductList />
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '10px',
    background: 'linear-gradient(to right, #ece9e6, #ffffff)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
};

export default SellerDashboard;
