import React from 'react';

const PurchaseSummary = ({ summary, onConfirm, onCancel }) => {
  const { originalCost, tax, discount, finalCost, quantity, productName } = summary;

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h3 style={styles.title}>Confirm Your Purchase</h3>
        <p style={styles.productInfo}>{quantity} x {productName}</p>
        <div style={styles.priceBreakdown}>
          <div style={styles.priceRow}>
            <span>Original Cost</span>
            <span>₹{originalCost.toFixed(2)}</span>
          </div>
          <div style={styles.priceRow}>
            <span>Tax</span>
            <span>+ ₹{tax.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div style={styles.priceRow}>
              <span>Featured Discount (10%)</span>
              <span style={styles.discount}>- ₹{discount.toFixed(2)}</span>
            </div>
          )}
          <hr style={styles.hr} />
          <div style={{...styles.priceRow, ...styles.finalCost}}>
            <span>Final Cost</span>
            <span>₹{finalCost.toFixed(2)}</span>
          </div>
        </div>
        <div style={styles.buttonContainer}>
          <button onClick={onConfirm} style={styles.confirmButton}>Confirm Purchase</button>
          <button onClick={onCancel} style={styles.cancelButton}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    width: '400px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  productInfo: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
    marginBottom: '20px',
  },
  priceBreakdown: {
    marginBottom: '30px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    fontSize: '16px',
  },
  discount: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  hr: {
    border: 0,
    borderTop: '1px solid #eee',
    margin: '10px 0',
  },
  finalCost: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  confirmButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#dc3545',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default PurchaseSummary;
