import React, { useState } from 'react';
import CategoryList from '../components/buyer/CategoryList';
import ProductList from '../components/buyer/ProductList';
import SearchProduct from '../components/buyer/SearchProduct';

const BuyerDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Buyer Dashboard</h2>

      <div style={{ marginBottom: '20px' }}>
        <SearchProduct />
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <CategoryList selected={selectedCategory} onSelect={setSelectedCategory} />
        <ProductList category={selectedCategory} />
      </div>
    </div>
  );
};

export default BuyerDashboard;
