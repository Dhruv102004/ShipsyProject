import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryList = ({ selected, onSelect }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div style={{ width: '200px' }}>
      <h3>Categories</h3>
      <button
        onClick={() => onSelect('Featured')}
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '8px',
          backgroundColor: selected === 'Featured' ? '#333' : '#eee',
          color: selected === 'Featured' ? '#fff' : '#000',
          border: 'none',
          padding: '8px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Featured
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          style={{
            display: 'block',
            width: '100%',
            marginBottom: '8px',
            backgroundColor: selected === category ? '#333' : '#eee',
            color: selected === category ? '#fff' : '#000',
            border: 'none',
            padding: '8px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryList;
