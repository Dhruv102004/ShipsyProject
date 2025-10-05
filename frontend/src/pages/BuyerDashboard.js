import React, { useState } from 'react';
import CategoryList from '../components/buyer/CategoryList';
import ProductList from '../components/buyer/ProductList';
import SearchProduct from '../components/buyer/SearchProduct';
import Header from '../components/common/Header';

const BuyerDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('Featured');

  return (
    <div>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.title}>Buyer Dashboard</h2>

        <div style={styles.searchContainer}>
          <SearchProduct />
        </div>

        <div style={styles.mainContent}>
          <div style={styles.categoryContainer}>
            <CategoryList selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>
          <div style={styles.productContainer}>
            <ProductList category={selectedCategory} />
          </div>
        </div>
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
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  mainContent: {
    display: 'flex',
    gap: '40px',
  },
  categoryContainer: {
    flex: '0 0 250px',
  },
  productContainer: {
    flex: '1',
  },
};

export default BuyerDashboard;

