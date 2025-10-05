
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api';
import ProductModal from './ProductModal';
import ErrorDisplay from '../common/ErrorDisplay';
import ConfirmationDialog from '../common/ConfirmationDialog';
import SuccessDisplay from '../common/SuccessDisplay';

const ProductList = ({ products, onUpdate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const productsPerPage = 5;

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleDeleteRequest = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete}`);
      setProductToDelete(null);
      onUpdate(); // Refresh the list from the parent
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong while deleting the product.');
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

  const handleProductSave = () => {
    onUpdate(); // Refresh the list from the parent
    const isEdit = products.some((p) => p._id === selectedProduct?._id);
    if (isEdit) {
      setSuccess('Product updated successfully!');
    } else {
      setCurrentPage(1);
      setSuccess('Product added successfully!');
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
      <SuccessDisplay message={success} onClose={() => setSuccess(null)} />
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
              <p>Tax Rate: {product.taxRate}</p>

            </div>
            <div style={styles.productActions}>
              <button onClick={() => handleOpenModal(product)} style={styles.editButton}>Edit</button>
              <button onClick={() => setProductToDelete(product._id)} style={styles.deleteButton}>Delete</button>
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
      {productToDelete && (
        <ConfirmationDialog
          message="Are you sure you want to delete this product?"
          onConfirm={handleDeleteRequest}
          onCancel={() => setProductToDelete(null)}
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
