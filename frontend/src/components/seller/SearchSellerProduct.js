import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import api from '../../api';
import debounce from 'lodash.debounce';
import ProductModal from './ProductModal';
import ConfirmationDialog from '../common/ConfirmationDialog';
import ErrorDisplay from '../common/ErrorDisplay';

const SearchSellerProduct = ({ onProductUpdate }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.get('/products/seller/search', { params: { name: searchQuery } });
      setSuggestions(res.data.products || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Error fetching suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  useEffect(() => {
    debouncedFetchSuggestions(query);
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [query, debouncedFetchSuggestions]);

  const handleSelectProduct = (product) => {
    setQuery(product.productName);
    setSelectedProduct(product);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const clear = () => {
    setQuery('');
    setSuggestions([]);
    setSelectedProduct(null);
    setError('');
  };

  const handleProductSave = (savedProduct) => {
    setSelectedProduct(savedProduct);
    onProductUpdate();
  };

  const handleDeleteRequest = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete._id}`);
      setProductToDelete(null);
      clear();
      onProductUpdate();
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong while deleting the product.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchWrapper}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search your products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            style={styles.input}
          />
          <button type="button" onClick={clear} style={styles.clearButton}>
            Clear
          </button>
        </div>

        {loading && <p style={styles.loading}>Loading...</p>}
        
        {showSuggestions && suggestions.length > 0 && (
          <ul style={styles.suggestionsList}>
            {suggestions.map((product) => (
              <li
                key={product._id}
                onClick={() => handleSelectProduct(product)}
                style={styles.suggestionItem}
              >
                {product.productName}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={styles.resultsContainer}>
        <ErrorDisplay message={error} onClose={() => setError(null)} />

        {selectedProduct && (
          <div style={styles.selectedProductCard}>
            <div style={{ flex: 1 }}>
              <h4 style={styles.productName}>{selectedProduct.productName}</h4>
              <p style={styles.productInfo}>Category: {selectedProduct.category}</p>
              
              <p style={styles.productInfo}>Price: ₹{selectedProduct.costPrice}</p>
              <p style={styles.productInfo}>Quantity: {selectedProduct.quantity}</p>

            </div>
            <div style={styles.productActions}>
              <button onClick={() => { setProductToEdit(selectedProduct); setIsModalOpen(true); }} style={styles.editButton}>Edit</button>
              <button onClick={() => setProductToDelete(selectedProduct)} style={styles.deleteButton}>Delete</button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProductModal
          product={productToEdit}
          onClose={() => setIsModalOpen(false)}
          onProductSaved={handleProductSave}
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
    maxWidth: '800px',
    margin: '0 auto',
  },
  searchWrapper: {
    position: 'relative',
    marginBottom: '20px',
  },
  searchBox: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  clearButton: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#6c757d',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
  loading: {
    textAlign: 'center',
    marginTop: '10px',
    color: '#555',
  },
  suggestionsList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    listStyle: 'none',
    margin: '5px 0 0',
    padding: 0,
    zIndex: 1000,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  suggestionItem: {
    padding: '12px 15px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
  },
  resultsContainer: {
    marginTop: '20px',
  },
  selectedProductCard: {
    border: '1px solid #eee',
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  productName: {
    margin: 0,
    color: '#333',
    fontSize: '18px',
  },
  productInfo: {
    margin: '8px 0',
    color: '#555',
  },
  productActions: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
  deleteButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
};

export default SearchSellerProduct;
