import React, { useState } from 'react';
import axios from 'axios';
import ConfirmationDialog from '../common/ConfirmationDialog';
import PriceDisplay from '../common/PriceDisplay';
import ErrorDisplay from '../common/ErrorDisplay';

const BuyProduct = ({ productName }) => {
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [error, setError] = useState(null);

  const handleBuy = () => {
    setShowConfirm(true);
    setError(null);
  };

  const onConfirm = async () => {
    setShowConfirm(false);
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

      setSellingPrice(res.data.sellingPrice);
      setShowPrice(true);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong!');
      }
    }
  };

  return (
    <div>
      <ErrorDisplay message={error} onClose={() => setError(null)} />
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        style={{ width: '60px', marginRight: '10px' }}
      />
      <button onClick={handleBuy}>Buy</button>
      {showConfirm && (
        <ConfirmationDialog
          message={`Buy ${quantity} of ${productName}?`}
          onConfirm={onConfirm}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {showPrice && (
        <PriceDisplay
          price={sellingPrice}
          onClose={() => setShowPrice(false)}
        />
      )}
    </div>
  );
};

export default BuyProduct;
