import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import HospitalDetail from './pages/HospitalDetail';
import Admin from './pages/Admin';
import Stats from './pages/Stats';
import InscriptionHopital from './pages/InscriptionHopital';
import SuperAdmin from './pages/SuperAdmin';
import LoginHopital from './pages/LoginHopital';
import DashboardHopital from './pages/DashboardHopital';

function PrivateRoute({ children }) {
  const user = localStorage.getItem('hospi_user');
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/inscription-hopital" element={<InscriptionHopital />} />
        <Route path="/super-admin" element={<SuperAdmin />} />
        <Route path="/login-hopital" element={<LoginHopital />} />
        <Route path="/dashboard-hopital" element={<DashboardHopital />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/hospital/:id" element={<PrivateRoute><HospitalDetail /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        <Route path="/stats" element={<PrivateRoute><Stats /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;