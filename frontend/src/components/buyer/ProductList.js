import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BuyProduct from '../buyer/BuyProduct';

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      try {
        const res = await axios.get('http://localhost:3001/api/products', {
          params: { category },
        });
        // API returns { products }
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, [category]);

  if (!category) return <p>Select a category to view products</p>;
  if (!products.length) return <p>No products found in this category</p>;

  return (
    <div style={{ flex: 1 }}>
      <h3>Products in "{category}"</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((product) => (
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
            <p>
              Price: ₹{
                product.price
                  ? product.price
                  : (product.costPrice * (1 + (product.taxRate || 0) / 100)).toFixed(2)
              }
            </p>
            <p>Available: {product.quantity}</p>
            <BuyProduct productName={product.productName} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
