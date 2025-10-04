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
    <div style={{
      border: '1px solid #e0e0e0',
      padding: '16px',
      borderRadius: '8px',
      maxWidth: '800px',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search product by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button type="button" onClick={clear} style={{ padding: '8px 12px', borderRadius: '6px' }}>
          Clear
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      {suggestions.length > 0 && (
        <ul style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          border: '1px solid #ccc',
          backgroundColor: 'white',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          zIndex: 1000
        }}>
          {suggestions.map((product) => (
            <li
              key={product._id}
              onClick={() => handleSelectProduct(product)}
              style={{ padding: '8px', cursor: 'pointer' }}
            >
              {product.productName}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '12px' }}>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        {selectedProduct && (
          <div style={{
            marginTop: '8px',
            border: '1px solid #ddd',
            padding: '12px',
            borderRadius: '8px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{selectedProduct.productName}</h4>
              <p style={{ margin: '6px 0' }}>
                Price: ₹{
                  selectedProduct.price
                    ? selectedProduct.price
                    : (selectedProduct.costPrice * (1 + (selectedProduct.taxRate || 0) / 100)).toFixed(2)
                }
              </p>
              <p style={{ margin: 0 }}>Available: {selectedProduct.quantity}</p>
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

export default SearchProduct;
