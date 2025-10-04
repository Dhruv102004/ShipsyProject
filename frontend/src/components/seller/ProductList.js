
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
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
          alert(err.response.data.message);
        } else {
          alert('Something went wrong');
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
          alert(err.response.data.message);
        } else {
          alert('Something went wrong');
        }
      }
    }
  };

  return (
    <div>
      <h2>Your Products</h2>
      <Link to="/add-product">Add Product</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.productName}</td>
              <td>{product.category}</td>
              <td>{product.costPrice}</td>
              <td>{product.quantity}</td>
              <td>{product.isFeatured ? 'Yes' : 'No'}</td>
              <td>
                <Link to={`/edit-product/${product._id}`}>Edit</Link>
                <button onClick={() => deleteProduct(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
