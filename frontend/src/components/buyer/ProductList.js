import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../api';
import BuyProduct from './BuyProduct';

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    color: '#333',
  },
  sortContainer: {
    display: 'flex',
    gap: '10px',
  },
  sortButton: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#333',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  activeSortButton: {
    padding: '8px 12px',
    border: '1px solid #007bff',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
  productCard: {
    position: 'relative',
    border: '1px solid #eee',
    padding: '15px',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  star: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: 'gold',
    fontSize: '24px',
  },
  noProducts: {
    textAlign: 'center',
    color: '#777',
    marginTop: '50px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30px',
  },
  arrowButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#007bff',
  },
  pageInfo: {
    margin: '0 15px',
    color: '#555',
  },
};

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      try {
        const params = {};
        if (category === 'Featured') {
          params.isFeatured = true;
        } else {
          params.category = category;
        }

  const res = await api.get('/products', { params });
  setProducts(res.data.products || []);
        setCurrentPage(1); // Reset to first page when category changes
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, [category]);

  const getPrice = (product) => {
    return product.price
      ? product.price
      : (product.costPrice * (1 + (product.taxRate || 0) / 100));
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === 'low-to-high') {
      return getPrice(a) - getPrice(b);
    }
    if (sortOrder === 'high-to-low') {
      return getPrice(b) - getPrice(a);
    }
    return 0;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  if (!products.length && category) {
    return <p style={styles.noProducts}>No products found in this category</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Products in "{category}"</h3>
        <div style={styles.sortContainer}>
          <button
            onClick={() => setSortOrder('low-to-high')}
            style={sortOrder === 'low-to-high' ? styles.activeSortButton : styles.sortButton}
          >
            Price: Low to High
          </button>
          <button
            onClick={() => setSortOrder('high-to-low')}
            style={sortOrder === 'high-to-low' ? styles.activeSortButton : styles.sortButton}
          >
            Price: High to Low
          </button>
        </div>
      </div>
      <div style={styles.productList}>
        {currentProducts.map((product) => (
          <div key={product._id} style={styles.productCard}>
            {product.isFeatured && <div style={styles.star}>★</div>}
            <h4>{product.productName}</h4>
            <p>Price: ₹{getPrice(product).toFixed(2)}</p>
            <p>Available: {product.quantity}</p>
            <BuyProduct product={product} />
          </div>
        ))}
      </div>
      <div style={styles.pagination}>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} style={styles.arrowButton}>
          ‹
        </button>
        <span style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} style={styles.arrowButton}>
          ›
        </button>
      </div>
    </div>
  );
};

export default ProductList;
