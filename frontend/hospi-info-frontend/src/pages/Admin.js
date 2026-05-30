import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Admin() {
  const [hospitals, setHospitals] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const chargerHopitaux = () => {
      axios.get('https://MouhaemedDiouf221.pythonanywhere.com/api/hospitals/')
        .then(res => setHospitals(res.data))
        .catch(err => console.error(err));
    };

    chargerHopitaux();
    const interval = setInterval(chargerHopitaux, 30000);

    return () => clearInterval(interval);
  }, []);

  const updateBeds = (id, value) => {
    axios.patch(`https://MouhaemedDiouf221.pythonanywhere.com/api/hospitals/${id}/beds/`,
      { available_beds: parseInt(value) },
      { auth: { username: 'admin', password: 'admin' } }
    )
    .then(() => setMessage('✅ Mis à jour avec succès !'))
    .catch(() => setMessage('❌ Erreur de mise à jour.'));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(/hospi-info.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      fontFamily: 'Segoe UI, sans-serif',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(0,40,100,0.75) 0%, rgba(0,100,160,0.65) 100%)',
        zIndex: 0
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* HEADER */}
        <div style={{ padding: '60px 30px', textAlign: 'center', color: 'white', position: 'relative' }}>
          <button onClick={() => navigate('/home')}
            style={{ position: 'absolute', left: '20px', top: '20px',
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)',
              color: 'white', padding: '8px 20px', borderRadius: '50px', cursor: 'pointer' }}>
            ⬅ Retour
          </button>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>
            ⚙️ Interface Admin
          </h1>
          <p style={{ opacity: 0.9 }}>Gestion des lits hospitaliers</p>
        </div>

        {/* CONTENU */}
        <div style={{ maxWidth: '750px', margin: '0 auto', padding: '0 20px' }}>
          {message && (
            <div style={{ padding: '14px', borderRadius: '12px', marginBottom: '20px',
              background: message.includes('✅') ? '#eafaf1' : '#fdecea',
              color: message.includes('✅') ? '#2ecc71' : '#e74c3c',
              fontWeight: '600', textAlign: 'center' }}>
              {message}
            </div>
          )}

          {Array.isArray(hospitals) && hospitals.map(h => (
            <div key={h.id} style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px',
              padding: '20px', marginBottom: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderLeft: `5px solid ${h.available_beds > 0 ? '#2ecc71' : '#e74c3c'}` }}>
              <h2 style={{ color: '#1a3a6b', marginBottom: '6px' }}>{h.name}</h2>
              <p style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>📍 {h.city}</p>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#f0f7ff', borderRadius: '10px', padding: '8px 16px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#1d72b8' }}>{h.total_beds}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Lits totaux</div>
                </div>
                <div style={{ background: '#f0f7ff', borderRadius: '10px', padding: '8px 16px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#2ecc71' }}>{h.available_beds}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Disponibles</div>
                </div>
                <div style={{ background: '#fff0f0', borderRadius: '10px', padding: '8px 16px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '700', color: '#e74c3c' }}>{h.occupancy_rate}%</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Occupation</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ color: '#555', fontSize: '14px' }}>Lits disponibles :</label>
                <input
                  type="number"
                  defaultValue={h.available_beds}
                  min="0"
                  max={h.total_beds}
                  id={`beds-${h.id}`}
                  style={{ width: '80px', padding: '8px', borderRadius: '8px',
                    border: '2px solid #e0e8f0', fontSize: '15px', textAlign: 'center' }}
                />
                <button
                  onClick={() => updateBeds(h.id, document.getElementById(`beds-${h.id}`).value)}
                  style={{ padding: '8px 20px', background: '#1d72b8', color: 'white',
                    border: 'none', borderRadius: '50px', cursor: 'pointer',
                    fontSize: '14px', fontWeight: '500' }}>
                  Mettre à jour
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{ background: 'rgba(0,20,60,0.85)', color: 'white', marginTop: '40px',
          padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ marginBottom: '20px', opacity: 0.8, fontSize: '14px' }}>
            Projet de fin d'études — Génie Informatique 2026
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', marginBottom: '20px' }}>
            
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>Assietou Ndong</div>
              <div style={{ opacity: 0.8, fontSize: '14px' }}>Co-développeuse</div>
            </div>
          </div>
          <div style={{ opacity: 0.5, fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px' }}>
            © 2026 HOSPI-INFO — Tous droits réservés
          </div>
        </div>

      </div>
    </div>
  );
}

export default Admin;