import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://MouhaemedDiouf221.pythonanywhere.com';

function LoginHopital() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Si déjà connecté, rediriger
  useEffect(() => {
    const hopital = localStorage.getItem('hopital_connecte');
    if (hopital) navigate('/dashboard-hopital');
  }, [navigate]);

  const handleLogin = async () => {
    if (!email) {
      setError('Veuillez entrer votre email.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await axios.get(`${API}/api/hospitals/`);
      const hospitals = res.data;

      const hopital = hospitals.find(h =>
        h.email && h.email.toLowerCase() === email.toLowerCase()
      );

      if (!hopital) {
        setError('Aucun hôpital trouvé avec cet email. Vérifiez vos informations ou inscrivez votre hôpital.');
        setLoading(false);
        return;
      }

      // Vérifier mot de passe
      if (password && hopital.password && hopital.password !== password) {
        setError('Mot de passe incorrect.');
        setLoading(false);
        return;
      }

      // Connexion réussie
      localStorage.setItem('hopital_connecte', JSON.stringify({
        id: hopital.id,
        name: hopital.name,
        email: hopital.email
      }));
      navigate('/dashboard-hopital');

    } catch (err) {
      setError('Erreur de connexion. Vérifiez votre connexion internet.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '40px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏥</div>
          <h1 style={{ color: '#0f172a', fontSize: '1.6rem',
            fontWeight: '800', marginBottom: '6px' }}>
            Espace Hôpital
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Connectez-vous pour gérer votre hôpital en temps réel
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626',
            padding: '12px 16px', borderRadius: '12px',
            marginBottom: '20px', fontSize: '14px',
            textAlign: 'center', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#374151', fontSize: '14px', fontWeight: '700' }}>
            Email de l'hôpital
          </label>
          <input
            type="email"
            placeholder="hopital@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '14px 16px', borderRadius: '12px',
              border: '2px solid #e2e8f0', fontSize: '15px', marginTop: '6px',
              outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: '#374151', fontSize: '14px', fontWeight: '700' }}>
            Mot de passe (optionnel)
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', padding: '14px 16px', borderRadius: '12px',
              border: '2px solid #e2e8f0', fontSize: '15px', marginTop: '6px',
              outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }}
          />
          <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>
            💡 Si vous n'avez pas de mot de passe, laissez vide
          </div>
        </div>

        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', padding: '14px',
            background: loading ? '#94a3b8' :
              'linear-gradient(135deg, #0f172a, #2563eb)',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 15px rgba(37,99,235,0.4)',
            marginBottom: '16px' }}>
          {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
        </button>

        <div style={{ textAlign: 'center', padding: '16px',
          background: '#f8fafc', borderRadius: '12px', marginBottom: '16px' }}>
          <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>
            Pas encore inscrit ?
          </div>
          <button onClick={() => navigate('/inscription-hopital')}
            style={{ background: '#dcfce7', color: '#16a34a', border: 'none',
              padding: '8px 20px', borderRadius: '50px', cursor: 'pointer',
              fontWeight: '700', fontSize: '14px' }}>
            🏥 Inscrire mon hôpital
          </button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/home')}
            style={{ background: 'none', border: 'none',
              color: '#6b7280', cursor: 'pointer', fontSize: '13px' }}>
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginHopital;