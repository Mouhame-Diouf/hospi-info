import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!nom || !email || !password || !confirm) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    localStorage.setItem('hospi_user', JSON.stringify({ nom, email }));
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
          <p style={{ color: '#888', fontSize: '14px' }}>Créez votre compte</p>
        </div>

        {error && (
          <div style={{ background: '#fdecea', color: '#e74c3c', padding: '12px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>Nom complet</label>
          <input
            type="text"
            placeholder="Votre nom"
            value={nom}
            onChange={e => setNom(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px',
              border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
              outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>Email</label>
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px',
              border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
              outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
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

        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>Confirmer le mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px',
              border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
              outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={handleRegister}
          style={{ width: '100%', padding: '14px', background: '#1d72b8',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '16px', fontWeight: '600', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(29,114,184,0.4)' }}>
          Créer mon compte →
        </button>

        <div style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '14px' }}>
          Déjà un compte ?{' '}
          <span onClick={() => navigate('/login')}
            style={{ color: '#1d72b8', cursor: 'pointer', fontWeight: '600' }}>
            Se connecter
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;