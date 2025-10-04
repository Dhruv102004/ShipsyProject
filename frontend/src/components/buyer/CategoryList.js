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
    <div style={styles.container}>
      <h3 style={styles.title}>Categories</h3>
      <div style={styles.buttonGroup}>
        <button
          onClick={() => onSelect('Featured')}
          style={selected === 'Featured' ? styles.selectedButton : styles.button}
        >
          Featured
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            style={selected === category ? styles.selectedButton : styles.button}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  button: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#333',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease-in-out',
  },
  selectedButton: {
    padding: '12px 15px',
    border: '1px solid #007bff',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)',
  },
};

export default CategoryList;


