import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(/hospi-info.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 50, 120, 0.75)'
      }}></div>

      <div style={{
        position: 'relative', zIndex: 1, textAlign: 'center',
        color: 'white', padding: '40px', maxWidth: '700px'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏥</div>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '12px' }}>
          HOSPI-INFO
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '16px' }}>
          Disponibilité hospitalière en temps réel
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.15)', borderRadius: '12px',
          padding: '24px', marginBottom: '32px', textAlign: 'left'
        }}>
          <p style={{ marginBottom: '12px', fontSize: '15px', lineHeight: '1.7' }}>
            🔍 <strong>HOSPI-INFO</strong> est une plateforme numérique qui permet de suivre
            en temps réel la disponibilité des lits hospitaliers au Sénégal.
          </p>
          <p style={{ marginBottom: '12px', fontSize: '15px', lineHeight: '1.7' }}>
            🚑 Elle aide les <strong>ambulanciers</strong> et les <strong>familles</strong> à
            localiser rapidement un hôpital disponible en cas d'urgence.
          </p>
          <p style={{ fontSize: '15px', lineHeight: '1.7' }}>
            🏨 Les <strong>établissements de santé</strong> peuvent mettre à jour
            leurs informations en temps réel via une interface sécurisée.
          </p>
        </div>

        {/* BOUTONS */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: '#ffffff', color: '#1d72b8',
              border: 'none', padding: '16px 48px',
              borderRadius: '50px', fontSize: '18px',
              fontWeight: 'bold', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              width: '100%', maxWidth: '320px'
            }}>
            Accéder à l'application →
          </button>

          <button
            onClick={() => navigate('/inscription-hopital')}
            style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.6)',
              padding: '14px 48px',
              borderRadius: '50px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '320px'
            }}>
            🏥 Inscrire mon hôpital
          </button>

          <button
            onClick={() => navigate('/super-admin')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '10px 32px',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
              maxWidth: '320px'
            }}>
            ⚙️ Espace Super Admin
          </button>
        </div>

        <p style={{ marginTop: '24px', fontSize: '13px', opacity: 0.6 }}>
          Projet de fin d'études — Génie Informatique 2026
        </p>
      </div>
    </div>
  );
}

export default Landing;