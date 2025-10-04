
import React, { useState } from 'react';
import axios from 'axios';

const BuyProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: 1,
  });
  const [sellingPrice, setSellingPrice] = useState(null);

  const { productName, quantity } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to buy this product?')) {
      try {
        const res = await axios.post('http://localhost:3001/api/buy', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSellingPrice(res.data.sellingPrice);
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
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          name="productName"
          value={productName}
          onChange={onChange}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          name="quantity"
          value={quantity}
          onChange={onChange}
          min="1"
          required
        />
        <input type="submit" value="Buy" />
      </form>
      {sellingPrice && <div>Total Price: {sellingPrice}</div>}
    </div>
  );
};

export default BuyProduct;
