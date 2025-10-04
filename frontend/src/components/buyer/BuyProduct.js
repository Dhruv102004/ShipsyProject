import React, { useState } from 'react';
import axios from 'axios';

const BuyProduct = ({ productName }) => {
  const [quantity, setQuantity] = useState(1);

  const handleBuy = async () => {
    if (!window.confirm(`Buy ${quantity} of ${productName}?`)) return;

    try {
      const res = await axios.post(
        'http://localhost:3001/api/buy',
        { productName, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const sellingPrice = res.data.sellingPrice;
      alert(`Purchase successful! Total Price: ₹${sellingPrice}`);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Something went wrong!');
      }
    }
  };

  return (
    <div>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ width: '60px', marginRight: '10px' }}
      />
      <button onClick={handleBuy}>Buy</button>
    </div>
  );
};

export default BuyProduct;
