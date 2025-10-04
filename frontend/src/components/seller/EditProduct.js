
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    productName: '',
    category: 'Other',
    costPrice: '',
    quantity: '',
    isFeatured: false,
    taxRate: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFormData(res.data);
      } catch (err) {
        console.error(err);
        if (err.response) {
          alert(err.response.data.message);
        } else {
          alert('Something went wrong');
        }
      }
    };

    fetchProduct();
  }, [id]);

  const { productName, category, costPrice, quantity, isFeatured, taxRate } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onCheckboxChange = (e) => {
    setFormData({ ...formData, isFeatured: e.target.checked });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3001/api/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(res.data);
    } catch (err) {
      console.error(err);
      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert('Something went wrong');
      }
    }
  };

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
      <input type="submit" value="Update Product" />
    </form>
  );
};

export default EditProduct;
