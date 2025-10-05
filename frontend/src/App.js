
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import api from './api';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/auth/me');
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
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route
          path="/seller-dashboard"
          element={<PrivateRoute> <SellerDashboard /> </PrivateRoute>}
        /><Route
          path="/buyer-dashboard"
          element={<PrivateRoute> <BuyerDashboard /> </PrivateRoute>}
        />
      </Routes>
    </Router>
  );
}

export default App;
