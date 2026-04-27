import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginHopital() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/hospitals/')
      .then(res => setHospitals(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    // Chercher l'hôpital par email
    const hopital = hospitals.find(h =>
      h.email === email || h.phone === email
    );

    if (!hopital) {
      setError('Aucun hôpital trouvé avec cet email. Vérifiez vos informations.');
      return;
    }

    localStorage.setItem('hopital_connecte', JSON.stringify({ id: hopital.id, name: hopital.name }));
    navigate('/dashboard-hopital');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(/hospi-info.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(0,40,100,0.80) 0%, rgba(0,100,160,0.70) 100%)',
        zIndex: 0
      }}></div>

      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '20px', padding: '40px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem' }}>🏥</div>
          <h1 style={{ color: '#1a3a6b', fontSize: '1.6rem', marginBottom: '6px' }}>
            Espace Hôpital
          </h1>
          <p style={{ color: '#888', fontSize: '14px' }}>
            Connectez-vous pour gérer votre hôpital
          </p>
        </div>

        {error && (
          <div style={{ background: '#fdecea', color: '#e74c3c', padding: '12px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>
            Email de l'hôpital
          </label>
          <input
            type="email"
            placeholder="hopital@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px',
              border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
              outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px',
              border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
              outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button onClick={handleLogin}
          style={{ width: '100%', padding: '14px', background: '#1d72b8',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '16px', fontWeight: '600', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(29,114,184,0.4)' }}>
          Se connecter →
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '14px' }}>
          Pas encore inscrit ?{' '}
          <span onClick={() => navigate('/inscription-hopital')}
            style={{ color: '#1d72b8', cursor: 'pointer', fontWeight: '600' }}>
            Inscrire mon hôpital
          </span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <span onClick={() => navigate('/login')}
            style={{ color: '#888', cursor: 'pointer', fontSize: '13px' }}>
            ← Retour connexion utilisateur
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginHopital;