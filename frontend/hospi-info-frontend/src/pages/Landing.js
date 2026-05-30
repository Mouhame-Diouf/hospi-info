import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif', padding: '20px'
    }}>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🏥</div>
        <div style={{ color: 'white', fontSize: '2.5rem',
          fontWeight: '800', letterSpacing: '2px' }}>
          HOSPI-INFO
        </div>
        <div style={{ color: '#4ade80', fontSize: '14px',
          fontWeight: '600', marginTop: '8px', letterSpacing: '1px' }}>
          DISPONIBILITÉ HOSPITALIÈRE EN TEMPS RÉEL
        </div>
        <div style={{ color: '#94a3b8', fontSize: '15px',
          maxWidth: '360px', lineHeight: '1.6',
          margin: '24px auto 48px' }}>
          Trouvez instantanément un hôpital disponible près de chez vous au Sénégal
        </div>

        <button onClick={() => navigate('/home')}
          style={{ width: '320px', padding: '18px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white', border: 'none', borderRadius: '16px',
            cursor: 'pointer', fontWeight: '800', fontSize: '16px',
            boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
          🏥 Accéder à l'application
        </button>
      </div>

    </div>
  );
}

export default Landing;