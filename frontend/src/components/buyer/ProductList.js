import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BuyProduct from '../buyer/BuyProduct';

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const styles = {
    arrowButton: {
      background: '#fff',
      border: '1px solid #ddd',
      padding: '6px 10px',
      borderRadius: '6px',
      cursor: 'pointer',
    },
  };

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

        const res = await axios.get('http://localhost:3001/api/products', { params });
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

  if (!category) return <p>Select a category to view products</p>;
  if (!products.length) return <p>No products found in this category</p>;

  return (
    <div style={{ flex: 1 }}>
      <h3>Products in "{category}"</h3>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setSortOrder('low-to-high')}>
          Sort by Price: Low to High
        </button>
        <button onClick={() => setSortOrder('high-to-low')} style={{ marginLeft: '10px' }}>
          Sort by Price: High to Low
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {currentProducts.map((product) => (
          <div
            key={product._id}
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              borderRadius: '10px',
              width: '200px',
            }}
          >
            <h4>{product.productName}</h4>
            <p>Price: ₹{getPrice(product).toFixed(2)}</p>
            <p>Available: {product.quantity}</p>
            <BuyProduct productName={product.productName} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} style={styles.arrowButton}>
          ‹
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} style={styles.arrowButton}>
          ›
        </button>
      </div>
    </div>
  );
};

const styles = {
  arrowButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
};

export default ProductList;
