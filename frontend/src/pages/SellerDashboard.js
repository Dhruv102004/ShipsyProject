
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductList from '../components/seller/ProductList';
import Header from '../components/common/Header';
import SearchSellerProduct from '../components/seller/SearchSellerProduct';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/products/seller', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong while fetching products.');
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.title}>Seller Dashboard</h1>
        <SearchSellerProduct onProductUpdate={fetchProducts} />
        <ProductList products={products} onUpdate={fetchProducts} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
};


export default SellerDashboard;
