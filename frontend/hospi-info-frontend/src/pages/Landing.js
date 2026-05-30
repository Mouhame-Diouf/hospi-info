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

        {/* LOGO */}
        <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🏥</div>
        <div style={{ color: 'white', fontSize: '2.5rem',
          fontWeight: '800', letterSpacing: '2px' }}>
          HOSPI-INFO
        </div>
        <div style={{ color: '#4ade80', fontSize: '14px',
          fontWeight: '600', marginTop: '8px', letterSpacing: '1px' }}>
          DISPONIBILITÉ HOSPITALIÈRE EN TEMPS RÉEL
        </div>

        {/* DESCRIPTION */}
        <div style={{ maxWidth: '400px', margin: '28px auto 40px', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '15px',
            lineHeight: '1.8', marginBottom: '14px' }}>
            <span style={{ color: 'white', fontWeight: '700' }}>HOSPI-INFO</span> est une plateforme
            numérique qui connecte les patients et les familles
            aux hôpitaux disponibles en temps réel au Sénégal.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '14px',
            lineHeight: '1.8', marginBottom: '14px' }}>
            Consultez la <span style={{ color: '#4ade80', fontWeight: '700' }}>
            disponibilité des lits</span>, les médecins en poste
            et prenez <span style={{ color: '#4ade80', fontWeight: '700' }}>
            rendez-vous en ligne</span> — sans appel,
            sans déplacement inutile.
          </p>
          <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.8' }}>
            💚 Gratuit &nbsp;•&nbsp; Accessible 24h/24 &nbsp;•&nbsp; Sur tout appareil
          </p>
        </div>

        {/* BOUTON */}
        <button onClick={() => navigate('/home')}
          style={{ width: '320px', padding: '18px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white', border: 'none', borderRadius: '16px',
            cursor: 'pointer', fontWeight: '800', fontSize: '16px',
            boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
            transition: 'transform 0.2s' }}>
          🏥 Accéder à l'application
        </button>

        {/* STATS */}
        <div style={{ display: 'flex', gap: '40px',
          marginTop: '48px', justifyContent: 'center' }}>
          {[
            { value: '6+', label: 'Hôpitaux' },
            { value: '24/7', label: 'Disponible' },
            { value: '100%', label: 'Gratuit' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: '#4ade80', fontSize: '1.5rem',
                fontWeight: '800' }}>{s.value}</div>
              <div style={{ color: '#64748b', fontSize: '12px',
                marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Landing;