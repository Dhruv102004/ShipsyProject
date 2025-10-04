
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AddProduct from './components/seller/AddProduct';
import EditProduct from './components/seller/EditProduct';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get('http://localhost:3001/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route
          path="/seller-dashboard"
          element={<PrivateRoute> <SellerDashboard /> </PrivateRoute>}
        /><Route
          path="/buyer-dashboard"
          element={<PrivateRoute> <BuyerDashboard /> </PrivateRoute>}
        />
        <Route path="/add-product" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
        <Route path="/edit-product/:id" element={<PrivateRoute><EditProduct /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
