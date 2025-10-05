import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorDisplay from '../common/ErrorDisplay';

const ProductModal = ({ product, onClose, onProductSaved, onSwitchToEdit }) => {
  const isEditMode = Boolean(product);
  const [formData, setFormData] = useState(
    isEditMode
      ? product
      : {
          productName: '',
          category: 'Other',
          costPrice: '',
          quantity: '',
          isFeatured: false,
          taxRate: '',
        }
  );
  const [error, setError] = useState(null);
  const [existingProduct, setExistingProduct] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      setFormData(product);
    } else {
      setFormData({
        productName: '',
        category: 'Other',
        costPrice: '',
        quantity: '',
        isFeatured: false,
        taxRate: '',
      });
    }
    setError(null);
    setExistingProduct(null);
  }, [product, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setExistingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        const res = await axios.put(
          `http://localhost:3001/api/products/${product._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        onProductSaved(res.data);
        onClose();
      } else {
        // Check for existing product
        const sellerProductsRes = await axios.get('http://localhost:3001/api/products/seller', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const existing = sellerProductsRes.data.find(
          p => p.productName.toLowerCase() === formData.productName.toLowerCase()
        );

        if (existing) {
          setError('A product with this name already exists.');
          setExistingProduct(existing);
          return;
        }

        const res = await axios.post('http://localhost:3001/api/products', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        onProductSaved(res.data);
        onClose();
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const handleSwitchToEdit = () => {
    if (onSwitchToEdit && existingProduct) {
      onSwitchToEdit(existingProduct);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>{isEditMode ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <ErrorDisplay message={error} onClose={() => setError(null)} />
          {existingProduct && (
            <div style={styles.existingProductContainer}>
              <p>A product with this name already exists.</p>
              <button type="button" onClick={handleSwitchToEdit} style={styles.editExistingButton}>
                Edit Existing Product
              </button>
            </div>
          )}
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Price</label>
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Tax Rate (%)</label>
            <input
              type="number"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Featured</label>
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
            />
          </div>
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>
              {isEditMode ? 'Update' : 'Add'}
            </button>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(5px)',
  },
  modal: {
    background: 'rgba(255, 255, 255, 0.9)',
    padding: '30px',
    borderRadius: '15px',
    width: '500px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    boxSizing: 'border-box',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '30px',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '10px',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    padding: '12px 24px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  existingProductContainer: {
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffeeba',
    marginBottom: '20px',
    textAlign: 'center',
  },
  editExistingButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#ffc107',
    color: '#212529',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s ease-in-out',
  },
};

export default ProductModal;

