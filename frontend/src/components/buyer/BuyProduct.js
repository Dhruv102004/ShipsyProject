import React, { useState } from 'react';
import axios from 'axios';
import ErrorDisplay from '../common/ErrorDisplay';
import PurchaseSummary from '../common/PurchaseSummary';

const BuyProduct = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [error, setError] = useState(null);
  const [purchaseSummary, setPurchaseSummary] = useState(null);

  const handleBuy = () => {
    const originalCost = product.costPrice * quantity;
    const tax = originalCost * (product.taxRate / 100);
    const discount = product.isFeatured ? originalCost * 0.10 : 0;
    const finalCost = originalCost + tax - discount;

    setPurchaseSummary({
      originalCost,
      tax,
      discount,
      finalCost,
      quantity,
      productName: product.productName,
    });

    setShowSummary(true);
    setError(null);
  };

  const onConfirm = async () => {
    setShowSummary(false);
    try {
      await axios.post(
        'http://localhost:3001/api/buy',
        { productName: product.productName, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Purchase successful!');
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
      <div style={styles.container}>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={styles.input}
        />
        <button onClick={handleBuy} style={styles.buyButton}>Buy</button>
      </div>
      {showSummary && (
        <PurchaseSummary
          summary={purchaseSummary}
          onConfirm={onConfirm}
          onCancel={() => setShowSummary(false)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    width: '70px',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    textAlign: 'center',
  },
  buyButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
  },
};

export default BuyProduct;

