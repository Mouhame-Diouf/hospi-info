import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif', padding: '20px' }}>

      {/* LOGO */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🏥</div>
        <div style={{ color: 'white', fontSize: '2.5rem',
          fontWeight: '800', letterSpacing: '2px' }}>
          HOSPI-INFO
        </div>
        <div style={{ color: '#4ade80', fontSize: '14px',
          fontWeight: '600', marginTop: '8px', letterSpacing: '1px' }}>
          DISPONIBILITÉ HOSPITALIÈRE EN TEMPS RÉEL
        </div>
      </div>

      {/* DESCRIPTION */}
      <div style={{ color: '#94a3b8', fontSize: '15px', textAlign: 'center',
        maxWidth: '360px', lineHeight: '1.6', marginBottom: '48px' }}>
        Trouvez instantanément un hôpital disponible près de chez vous au Sénégal
      </div>

      {/* BOUTON PRINCIPAL - PATIENT */}
      <button onClick={() => navigate('/home')}
        style={{ width: '100%', maxWidth: '340px', padding: '18px',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: 'white', border: 'none', borderRadius: '16px',
          cursor: 'pointer', fontWeight: '800', fontSize: '16px',
          marginBottom: '14px', boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
        🏥 Accéder à l'application
      </button>

      {/* BOUTON PROFESSIONNEL - CONNEXION UNIQUE */}
      <button onClick={() => navigate('/connexion')}
        style={{ width: '100%', maxWidth: '340px', padding: '16px',
          background: 'rgba(255,255,255,0.08)',
          color: 'white', border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '16px', cursor: 'pointer',
          fontWeight: '700', fontSize: '15px', marginBottom: '14px' }}>
        👨‍⚕️ Espace Professionnel
      </button>

      {/* BOUTON INSCRIPTION HÔPITAL */}
      <button onClick={() => navigate('/inscription-hopital')}
        style={{ width: '100%', maxWidth: '340px', padding: '16px',
          background: 'rgba(74,222,128,0.1)',
          color: '#4ade80', border: '2px solid rgba(74,222,128,0.3)',
          borderRadius: '16px', cursor: 'pointer',
          fontWeight: '700', fontSize: '15px' }}>
        ➕ Inscrire mon hôpital
      </button>

      {/* STATS */}
      <div style={{ display: 'flex', gap: '32px', marginTop: '48px' }}>
        {[
          { value: '6+', label: 'Hôpitaux' },
          { value: '24/7', label: 'Disponible' },
          { value: '100%', label: 'Gratuit' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ color: '#4ade80', fontSize: '1.4rem', fontWeight: '800' }}>
              {s.value}
            </div>
            <div style={{ color: '#64748b', fontSize: '12px' }}>{s.label}</div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Landing;