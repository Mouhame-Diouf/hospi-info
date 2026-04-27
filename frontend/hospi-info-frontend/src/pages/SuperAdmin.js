import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SuperAdmin() {
  const [authentifie, setAuthentifie] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [liste, setListe] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const login = () => {
    if (password === 'superadmin2026') {
      setAuthentifie(true);
      setError('');
    } else {
      setError('Mot de passe incorrect.');
    }
  };

  useEffect(() => {
    if (authentifie) {
      axios.get('http://localhost:8000/api/demandes/')
        .then(res => setListe(res.data))
        .catch(err => console.error(err));
    }
  }, [authentifie]);

  const approuver = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:8000/api/demandes/${id}/`, { statut: 'approuve' });
      setMessage('✅ ' + res.data.message);
      setListe(liste.map(d => d.id === id ? { ...d, statut: 'approuve' } : d));
    } catch (err) {
      setMessage('❌ Erreur lors de l\'approbation.');
    }
  };

  const rejeter = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:8000/api/demandes/${id}/`, { statut: 'rejete' });
      setMessage('❌ ' + res.data.message);
      setListe(liste.map(d => d.id === id ? { ...d, statut: 'rejete' } : d));
    } catch (err) {
      setMessage('❌ Erreur lors du rejet.');
    }
  };

  const total = liste.length;
  const enAttente = liste.filter(d => d.statut === 'en_attente').length;
  const approuves = liste.filter(d => d.statut === 'approuve').length;

  if (!authentifie) {
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
          background: 'linear-gradient(135deg, rgba(0,40,100,0.85) 0%, rgba(0,100,160,0.75) 100%)',
          zIndex: 0
        }}></div>

        <div style={{
          position: 'relative', zIndex: 1,
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px', padding: '40px',
          width: '100%', maxWidth: '380px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '3rem' }}>⚙️</div>
            <h1 style={{ color: '#1a3a6b', fontSize: '1.6rem', marginBottom: '6px' }}>
              Super Admin
            </h1>
            <p style={{ color: '#888', fontSize: '14px' }}>Accès réservé aux administrateurs</p>
          </div>

          {error && (
            <div style={{ background: '#fdecea', color: '#e74c3c', padding: '12px',
              borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>
              Mot de passe administrateur
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && login()}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px',
                border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
                outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button onClick={login}
            style={{ width: '100%', padding: '14px', background: '#1a3a6b',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Accéder →
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span onClick={() => navigate('/')}
              style={{ color: '#888', cursor: 'pointer', fontSize: '13px' }}>
              ← Retour à l'accueil
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{
        background: '#1a3a6b', color: 'white',
        padding: '20px 30px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>⚙️ Super Admin — HOSPI-INFO</h1>
          <p style={{ opacity: 0.8, fontSize: '13px' }}>Gestion des demandes d'inscription</p>
        </div>
        <button onClick={() => navigate('/')}
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none',
            color: 'white', padding: '8px 20px', borderRadius: '50px', cursor: 'pointer' }}>
          ← Accueil
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>

        {message && (
          <div style={{ padding: '14px', borderRadius: '12px', marginBottom: '20px',
            background: message.includes('✅') ? '#eafaf1' : '#fdecea',
            color: message.includes('✅') ? '#2ecc71' : '#e74c3c',
            fontWeight: '600', textAlign: 'center' }}>
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '30px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px',
            textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
            borderTop: '4px solid #1d72b8' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1d72b8' }}>{total}</div>
            <div style={{ color: '#888', fontSize: '13px' }}>Total demandes</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px',
            textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
            borderTop: '4px solid #e67e22' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#e67e22' }}>{enAttente}</div>
            <div style={{ color: '#888', fontSize: '13px' }}>En attente</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px',
            textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
            borderTop: '4px solid #2ecc71' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2ecc71' }}>{approuves}</div>
            <div style={{ color: '#888', fontSize: '13px' }}>Approuvés</div>
          </div>
        </div>

        <h2 style={{ color: '#1a3a6b', marginBottom: '16px' }}>Demandes d'inscription</h2>

        {liste.length === 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px',
            textAlign: 'center', color: '#888', boxShadow: '0 4px 15px rgba(0,0,0,0.07)' }}>
            Aucune demande pour l'instant.
          </div>
        )}

        {liste.map(d => (
          <div key={d.id} style={{
            background: 'white', borderRadius: '16px', padding: '20px',
            marginBottom: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
            borderLeft: `5px solid ${d.statut === 'approuve' ? '#2ecc71' : d.statut === 'rejete' ? '#e74c3c' : '#e67e22'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ color: '#1a3a6b', marginBottom: '4px' }}>{d.nom}</h3>
                <p style={{ color: '#888', fontSize: '13px' }}>📍 {d.ville}</p>
              </div>
              <span style={{
                padding: '5px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '600',
                background: d.statut === 'approuve' ? '#eafaf1' : d.statut === 'rejete' ? '#fdecea' : '#fef9e7',
                color: d.statut === 'approuve' ? '#2ecc71' : d.statut === 'rejete' ? '#e74c3c' : '#e67e22'
              }}>
                {d.statut === 'approuve' ? '✅ Approuvé' : d.statut === 'rejete' ? '❌ Rejeté' : '⏳ En attente'}
              </span>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', gap: '20px',
              flexWrap: 'wrap', fontSize: '13px', color: '#666' }}>
              <span>📞 {d.telephone}</span>
              <span>✉️ {d.email}</span>
              <span>🛏️ {d.totalLits} lits</span>
              <span>👤 {d.responsable}</span>
            </div>

            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {d.services && d.services.map(s => (
                <span key={s} style={{ background: '#f0f7ff', color: '#1d72b8',
                  padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                  {s}
                </span>
              ))}
            </div>

            {d.statut === 'en_attente' && (
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <button onClick={() => approuver(d.id)}
                  style={{ padding: '8px 24px', background: '#2ecc71', color: 'white',
                    border: 'none', borderRadius: '50px', cursor: 'pointer',
                    fontWeight: '600', fontSize: '14px' }}>
                  ✅ Approuver
                </button>
                <button onClick={() => rejeter(d.id)}
                  style={{ padding: '8px 24px', background: '#e74c3c', color: 'white',
                    border: 'none', borderRadius: '50px', cursor: 'pointer',
                    fontWeight: '600', fontSize: '14px' }}>
                  ❌ Rejeter
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuperAdmin;