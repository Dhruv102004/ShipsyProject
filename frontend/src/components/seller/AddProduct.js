
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    category: 'Other',
    costPrice: '',
    quantity: '',
    isFeatured: false,
    taxRate: '',
  });

  const { productName, category, costPrice, quantity, isFeatured, taxRate } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCheckboxChange = (e) => {
    setFormData({ ...formData, isFeatured: e.target.checked });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, fetch existing products for this seller and check for duplicates by name
      const listRes = await axios.get('http://localhost:3001/api/products/seller', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const existing = (listRes.data || []).find(
        (p) => p.productName && p.productName.toLowerCase() === productName.toLowerCase()
      );

      if (existing) {
        // If product exists, inform user and navigate to edit page for that product
        setExists({ found: true, id: existing._id });
        return;
      }

      const res = await axios.post('http://localhost:3001/api/products', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(res.data);
      // show success then navigate back to dashboard
      setSuccess(true);
      // navigate after a short delay so user sees the success feedback
      setTimeout(() => navigate('/seller-dashboard'), 1000);
    } catch (err) {
      console.error(err);
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert('Something went wrong');
      }
    }
  };

  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [exists, setExists] = useState({ found: false, id: null });

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Product Name"
        name="productName"
        value={productName}
        onChange={onChange}
        required
      />
      <select name="category" value={category} onChange={onChange}>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
        <option value="Books">Books</option>
        <option value="Home & Garden">Home & Garden</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="number"
        placeholder="Cost Price"
        name="costPrice"
        value={costPrice}
        onChange={onChange}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        name="quantity"
        value={quantity}
        onChange={onChange}
        required
      />
      <input
        type="number"
        placeholder="Tax Rate"
        name="taxRate"
        value={taxRate}
        onChange={onChange}
        required
      />
      <label>
        <input
          type="checkbox"
          name="isFeatured"
          checked={isFeatured}
          onChange={onCheckboxChange}
        />
        Featured
      </label>
      <input type="submit" value="Add Product" />
      {success && (
        <div>
          <p>Product added successfully.</p>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      )}
      {exists.found && (
        <div>
          <p>Product already exists.</p>
          <button onClick={() => navigate(`/edit-product/${exists.id}`)}>Edit existing product</button>
        </div>
      )}
    </form>
  );
};

export default AddProduct;
