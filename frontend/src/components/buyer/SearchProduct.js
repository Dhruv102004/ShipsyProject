import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import BuyProduct from './BuyProduct';

const SearchProduct = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.get('http://localhost:3001/api/products/search', {
        params: { name: searchQuery },
      });
      setSuggestions(res.data.products || []);
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
  };

  const clear = () => {
    setQuery('');
    setSuggestions([]);
    setSelectedProduct(null);
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchBox}>
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button type="button" onClick={clear} style={styles.clearButton}>
          Clear
        </button>
      </div>

      {loading && <p style={styles.loading}>Loading...</p>}
      
      {suggestions.length > 0 && (
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

      <div style={styles.resultsContainer}>
        {error && <p style={styles.error}>{error}</p>}

        {selectedProduct && (
          <div style={styles.selectedProductCard}>
            <div style={{ flex: 1 }}>
              <h4 style={styles.productName}>{selectedProduct.productName}</h4>
              <p style={styles.productPrice}>
                Price: ₹{
                  selectedProduct.price
                    ? selectedProduct.price
                    : (selectedProduct.costPrice * (1 + (selectedProduct.taxRate || 0) / 100)).toFixed(2)
                }
              </p>
              <p style={styles.productQuantity}>Available: {selectedProduct.quantity}</p>
            </div>
            <div style={{ minWidth: '220px' }}>
              <BuyProduct productName={selectedProduct.productName} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
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
    backgroundColor: '#dc3545',
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
  error: {
    color: 'crimson',
    textAlign: 'center',
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
  },
  productPrice: {
    margin: '8px 0',
    color: '#555',
  },
  productQuantity: {
    margin: 0,
    color: '#777',
  },
};

export default SearchProduct;

