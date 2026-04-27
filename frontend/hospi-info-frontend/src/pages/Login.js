import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('email'); // email ou telephone
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!identifiant || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    localStorage.setItem('hospi_user', JSON.stringify({ identifiant, mode }));
    navigate('/home');
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
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem' }}>🏥</div>
          <h1 style={{ color: '#1a3a6b', fontSize: '1.8rem', marginBottom: '6px' }}>HOSPI-INFO</h1>
          <p style={{ color: '#888', fontSize: '14px' }}>Connectez-vous à votre compte</p>
        </div>

        {/* CHOIX MODE */}
        <div style={{ display: 'flex', marginBottom: '24px', borderRadius: '10px',
          overflow: 'hidden', border: '2px solid #e0e8f0' }}>
          <button
            onClick={() => setMode('email')}
            style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
              background: mode === 'email' ? '#1d72b8' : 'white',
              color: mode === 'email' ? 'white' : '#555',
              fontWeight: '600', fontSize: '14px' }}>
            ✉️ Email
          </button>
          <button
            onClick={() => setMode('telephone')}
            style={{ flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
              background: mode === 'telephone' ? '#1d72b8' : 'white',
              color: mode === 'telephone' ? 'white' : '#555',
              fontWeight: '600', fontSize: '14px' }}>
            📱 Téléphone
          </button>
        </div>

        {error && (
          <div style={{ background: '#fdecea', color: '#e74c3c', padding: '12px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>
            {mode === 'email' ? 'Email' : 'Numéro de téléphone'}
          </label>
          {mode === 'telephone' ? (
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <div style={{ padding: '12px', background: '#f0f7ff', borderRadius: '10px',
                border: '2px solid #e0e8f0', color: '#1d72b8', fontWeight: '600' }}>
                🇸🇳 +221
              </div>
              <input
                type="tel"
                placeholder="77 000 00 00"
                value={identifiant}
                onChange={e => setIdentifiant(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '10px',
                  border: '2px solid #e0e8f0', fontSize: '15px', outline: 'none' }}
              />
            </div>
          ) : (
            <input
              type="email"
              placeholder="votre@email.com"
              value={identifiant}
              onChange={e => setIdentifiant(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px',
                border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
                outline: 'none', boxSizing: 'border-box' }}
            />
          )}
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>Mot de passe</label>
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

        {/* MOT DE PASSE OUBLIÉ */}
        <div style={{ textAlign: 'right', marginBottom: '24px' }}>
          <span
            onClick={() => navigate('/forgot-password')}
            style={{ color: '#1d72b8', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
            Mot de passe oublié ?
          </span>
        </div>

        <button
          onClick={handleLogin}
          style={{ width: '100%', padding: '14px', background: '#1d72b8',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '16px', fontWeight: '600', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(29,114,184,0.4)' }}>
          Se connecter →
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '14px' }}>
          Pas encore de compte ?{' '}
          <span onClick={() => navigate('/register')}
            style={{ color: '#1d72b8', cursor: 'pointer', fontWeight: '600' }}>
            S'inscrire
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;