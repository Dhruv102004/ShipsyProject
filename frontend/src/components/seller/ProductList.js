
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductModal from './ProductModal';
import ErrorDisplay from '../common/ErrorDisplay';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const productsPerPage = 5;
  const location = useLocation();

  useEffect(() => {
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

    fetchProducts();
  }, [location]);

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:3001/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProducts(products.filter((product) => product._id !== id));
      } catch (err) {
        console.error(err);
        if (err.response) {
          setError(err.response.data.message);
        } else {
          setError('Something went wrong while deleting the product.');
        }
      }
    }
  };

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setError(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleProductSave = (savedProduct) => {
    const isEdit = products.some((product) => product._id === savedProduct._id);
    if (isEdit) {
      setProducts(
        products.map((product) =>
          product._id === savedProduct._id ? savedProduct : product
        )
      );
    } else {
      setProducts([...products, savedProduct]);
    }
  };

  const handleSwitchToEdit = (product) => {
    setSelectedProduct(product);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div style={styles.container}>
      <ErrorDisplay message={error} onClose={() => setError(null)} />
      <div style={styles.header}>
        <h2>Your Products</h2>
        <button onClick={() => handleOpenModal()} style={styles.addButton}>Add Product</button>
      </div>
      <div style={styles.productList}>
        {currentProducts.map((product) => (
          <div key={product._id} style={styles.productCard}>
            {product.isFeatured && <div style={styles.star}>★</div>}
            <div style={styles.productInfo}>
              <h4>{product.productName}</h4>
              <p>Category: {product.category}</p>
              <p>Price: ₹{product.costPrice}</p>
              <p>Quantity: {product.quantity}</p>
            </div>
            <div style={styles.productActions}>
              <button onClick={() => handleOpenModal(product)} style={styles.editButton}>Edit</button>
              <button onClick={() => deleteProduct(product._id)} style={styles.deleteButton}>Delete</button>
            </div>
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
      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={handleModalClose}
          onProductSaved={handleProductSave}
          onSwitchToEdit={handleSwitchToEdit}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
  },
  star: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: 'gold',
    fontSize: '24px',
  },
  productInfo: {
    marginBottom: '20px',
  },
  productActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#2196F3',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    marginRight: '10px',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  arrowButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  pageInfo: {
    margin: '0 10px',
  }
};

export default ProductList;
