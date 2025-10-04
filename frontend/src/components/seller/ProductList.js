
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Your Products</h2>
        <Link to="/add-product" style={styles.addButton}>Add Product</Link>
      </div>
      <div style={styles.productList}>
        {currentProducts.map((product) => (
          <div key={product._id} style={styles.productCard}>
            {product.isFeatured && <div style={styles.star}>★</div>}
            <div style={styles.productInfo}>
              <h4>{product.productName}</h4>
              <p>Category: {product.category}</p>
              <p>Price: ₹{product.costPrice}</p>
              <p>Quantity: {product.quantity}</p>
            </div>
            <div style={styles.productActions}>
              <Link to={`/edit-product/${product._id}`} style={styles.editButton}>Edit</Link>
              <button onClick={() => deleteProduct(product._id)} style={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div style={styles.pagination}>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
  },
  productList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
  },
  star: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: 'gold',
    fontSize: '24px',
  },
  productInfo: {
    marginBottom: '20px',
  },
  productActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  editButton: {
    padding: '8px 16px',
    backgroundColor: '#2196F3',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    marginRight: '10px',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  pageInfo: {
    margin: '0 10px',
  }
};

export default ProductList;
