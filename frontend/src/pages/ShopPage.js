// src/pages/ShopPage.js
import React, { useState } from 'react';
import CategoryList from '../components/buyer/CategoryList';
import ProductList from '../components/buyer/ProductList';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <div style={{ width: 220 }}>
        <CategoryList selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      <div style={{ flex: 1 }}>
        <ProductList category={selectedCategory} />
      </div>
    </div>
  );
};

export default ShopPage;
