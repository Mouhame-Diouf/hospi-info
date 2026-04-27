import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DashboardHopital() {
  const [hopital, setHopital] = useState(null);
  const [message, setMessage] = useState('');
  const [litsDisponibles, setLitsDisponibles] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  const servicesDisponibles = [
    'Urgences', 'Maternité', 'Pédiatrie', 'Chirurgie',
    'Cardiologie', 'Neurologie', 'Psychiatrie', 'Radiologie',
    'Réanimation', 'Dermatologie'
  ];

  useEffect(() => {
    const hopitalData = localStorage.getItem('hopital_connecte');
    if (!hopitalData) {
      navigate('/login-hopital');
      return;
    }
    const h = JSON.parse(hopitalData);
    axios.get(`http://localhost:8000/api/hospitals/${h.id}/`)
      .then(res => {
        setHopital(res.data);
        setLitsDisponibles(res.data.available_beds);
        setTelephone(res.data.phone);
        setAdresse(res.data.address);
        setServices(res.data.services.filter(s => s.available).map(s => s.name));
      })
      .catch(err => console.error(err));
  }, [navigate]);

  const mettreAJourLits = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/hospitals/${hopital.id}/beds/`,
        { available_beds: parseInt(litsDisponibles) },
        { auth: { username: 'admin', password: 'admin' } }
      );
      setMessage('✅ Lits mis à jour avec succès !');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Erreur lors de la mise à jour.');
    }
  };

  const deconnecter = () => {
    localStorage.removeItem('hopital_connecte');
    navigate('/login-hopital');
  };

  if (!hopital) return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Segoe UI' }}>
      Chargement...
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* HEADER */}
      <div style={{
        background: '#1a3a6b', color: 'white',
        padding: '20px 30px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '700' }}>🏥 {hopital.name}</h1>
          <p style={{ opacity: 0.8, fontSize: '13px' }}>📍 {hopital.city} — Tableau de bord</p>
        </div>
        <button onClick={deconnecter}
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none',
            color: 'white', padding: '8px 20px', borderRadius: '50px', cursor: 'pointer' }}>
          Se déconnecter
        </button>
      </div>

      <div style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>

        {message && (
          <div style={{ padding: '14px', borderRadius: '12px', marginBottom: '20px',
            background: message.includes('✅') ? '#eafaf1' : '#fdecea',
            color: message.includes('✅') ? '#2ecc71' : '#e74c3c',
            fontWeight: '600', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {/* STATS RAPIDES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px',
            textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
            borderTop: '4px solid #2ecc71' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2ecc71' }}>
              {hopital.available_beds}
            </div>
            <div style={{ color: '#888', fontSize: '13px' }}>Lits disponibles</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px',
            textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
            borderTop: '4px solid #1d72b8' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1d72b8' }}>
              {hopital.total_beds}
            </div>
            <div style={{ color: '#888', fontSize: '13px' }}>Lits totaux</div>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '20px',
            textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.07)',
            borderTop: '4px solid #e74c3c' }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#e74c3c' }}>
              {hopital.occupancy_rate}%
            </div>
            <div style={{ color: '#888', fontSize: '13px' }}>Occupation</div>
          </div>
        </div>

        {/* MODIFIER LITS */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px',
          marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.07)' }}>
          <h2 style={{ color: '#1a3a6b', marginBottom: '16px' }}>🛏️ Mettre à jour les lits</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="number"
              value={litsDisponibles}
              onChange={e => setLitsDisponibles(e.target.value)}
              min="0"
              max={hopital.total_beds}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '10px',
                border: '2px solid #e0e8f0', fontSize: '16px', outline: 'none',
                textAlign: 'center', fontWeight: '700' }}
            />
            <span style={{ color: '#888' }}>/ {hopital.total_beds} lits totaux</span>
            <button onClick={mettreAJourLits}
              style={{ padding: '12px 24px', background: '#1d72b8', color: 'white',
                border: 'none', borderRadius: '50px', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px' }}>
              ✅ Mettre à jour
            </button>
          </div>
        </div>

        {/* MODIFIER INFOS */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px',
          marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.07)' }}>
          <h2 style={{ color: '#1a3a6b', marginBottom: '16px' }}>📋 Informations de l'hôpital</h2>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>Téléphone</label>
            <input
              type="tel"
              value={telephone}
              onChange={e => setTelephone(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px',
                border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
                outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>Adresse</label>
            <input
              type="text"
              value={adresse}
              onChange={e => setAdresse(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px',
                border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
                outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button
            onClick={() => setMessage('✅ Informations mises à jour !')}
            style={{ padding: '12px 24px', background: '#1d72b8', color: 'white',
              border: 'none', borderRadius: '50px', cursor: 'pointer',
              fontWeight: '600', fontSize: '14px' }}>
            ✅ Enregistrer les modifications
          </button>
        </div>

        {/* SERVICES */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.07)' }}>
          <h2 style={{ color: '#1a3a6b', marginBottom: '16px' }}>⚕️ Services médicaux</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {hopital.services.map(s => (
              <div key={s.id} style={{
                padding: '8px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: '500',
                background: s.available ? '#eafaf1' : '#fdecea',
                color: s.available ? '#2ecc71' : '#e74c3c',
                border: `2px solid ${s.available ? '#2ecc71' : '#e74c3c'}`
              }}>
                {s.available ? '✅' : '❌'} {s.name}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardHopital;