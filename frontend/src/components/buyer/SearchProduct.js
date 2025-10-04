import React, { useState } from 'react';
import axios from 'axios';
import BuyProduct from './BuyProduct'; // same component used in ProductList

const SearchProduct = () => {
  const [query, setQuery] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If your backend uses another endpoint, update this URL
  const handleSearch = async (e) => {
  e.preventDefault();
  setError('');
  setProduct(null);

  const trimmed = query.trim();
  if (!trimmed) {
    setError('Please enter a product name to search.');
    return;
  }

  try {
    setLoading(true);

    // ✅ Use the existing public products endpoint
    const res = await axios.get('http://localhost:3001/api/products', {
      params: { productName: trimmed },
    });

    // Backend returns { products: [...] }
    const products = res.data?.products || [];

    if (products.length > 0) {
      setProduct(products[0]); // show the first matching product
    } else {
      setError(`Product "${trimmed}" not found.`);
    }
  } catch (err) {
    console.error('Error searching product:', err);
    setError('Error searching product. Please check the server and try again.');
  } finally {
    setLoading(false);
  }
};


  const clear = () => {
    setQuery('');
    setProduct(null);
    setError('');
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      padding: '16px',
      borderRadius: '8px',
      maxWidth: '800px'
    }}>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search product by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 12px', borderRadius: '6px' }}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button type="button" onClick={clear} style={{ padding: '8px 12px', borderRadius: '6px' }}>
          Clear
        </button>
      </form>

      <div style={{ marginTop: '12px' }}>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}

        {product && (
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
              <h4 style={{ margin: 0 }}>{product.productName}</h4>
              <p style={{ margin: '6px 0' }}>
                Price: ₹{
                  product.price
                    ? product.price
                    : (product.costPrice * (1 + (product.taxRate || 0) / 100)).toFixed(2)
                }
              </p>
              <p style={{ margin: 0 }}>Available: {product.quantity}</p>
            </div>

            {/* Reuse the same BuyProduct component so functionality matches ProductList */}
            <div style={{ minWidth: '220px' }}>
              <BuyProduct productName={product.productName} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProduct;
