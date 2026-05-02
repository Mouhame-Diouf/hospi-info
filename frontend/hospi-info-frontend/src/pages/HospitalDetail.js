import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    axios.get(`https://MouhaemedDiouf221.pythonanywhere.com/api/hospitals/${id}/`)
      .then(res => setHospital(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* HEADER AVEC PHOTO */}
      <div style={{
        backgroundImage: 'url(/hospi-info.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white', padding: '60px 30px',
        textAlign: 'center', position: 'relative'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,40,100,0.55) 0%, rgba(0,100,160,0.45) 100%)'
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <button onClick={() => navigate('/home')}
            style={{ position: 'absolute', left: 0, top: 0,
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.5)',
              color: 'white', padding: '8px 20px', borderRadius: '50px', cursor: 'pointer' }}>
            ⬅ Retour
          </button>
          {hospital && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏥</div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '8px' }}>
                {hospital.name}
              </h1>
              <p style={{ opacity: 0.9 }}>📍 {hospital.city} — {hospital.address}</p>
            </>
          )}
        </div>
      </div>

      {/* CONTENU */}
      {!hospital ? (
        <p style={{ textAlign: 'center', padding: '50px' }}>Chargement...</p>
      ) : (
        <div style={{ maxWidth: '750px', margin: '30px auto', padding: '0 20px' }}>

          {/* INFOS */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px',
            marginBottom: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.07)' }}>
            <h2 style={{ color: '#1a3a6b', marginBottom: '16px' }}>Informations</h2>
            <p style={{ marginBottom: '8px', color: '#555' }}>📞 {hospital.phone || 'Non renseigné'}</p>
            <p style={{ marginBottom: '16px', color: '#555' }}>🏠 {hospital.address || 'Non renseignée'}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ background: '#f0f7ff', borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1d72b8' }}>
                  {hospital.available_beds}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>Lits disponibles</div>
              </div>
              <div style={{ background: '#f0f7ff', borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1d72b8' }}>
                  {hospital.total_beds}
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>Lits totaux</div>
              </div>
              <div style={{ background: '#fff0f0', borderRadius: '10px', padding: '12px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#e74c3c' }}>
                  {hospital.occupancy_rate}%
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>Occupation</div>
              </div>
            </div>
          </div>

          {/* SERVICES */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.07)' }}>
            <h2 style={{ color: '#1a3a6b', marginBottom: '16px' }}>Services médicaux</h2>
            {hospital.services.length === 0 && (
              <p style={{ color: '#999' }}>Aucun service enregistré.</p>
            )}
            {hospital.services.map(s => (
              <div key={s.id} style={{
                padding: '12px 16px', marginBottom: '8px', borderRadius: '10px',
                background: s.available ? '#eafaf1' : '#fdecea',
                color: s.available ? '#2ecc71' : '#e74c3c',
                fontWeight: '500', fontSize: '15px'
              }}>
                {s.available ? '✅' : '❌'} {s.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{ background: '#1a3a6b', color: 'white', marginTop: '40px',
        padding: '30px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px' }}>Mouhamed Diouf</div>
            <div style={{ opacity: 0.7, fontSize: '13px' }}>📞 +221 77 680 06 74</div>
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px' }}>Assietou Ndong</div>
            <div style={{ opacity: 0.7, fontSize: '13px' }}>Co-développeuse</div>
          </div>
        </div>
        <div style={{ opacity: 0.5, fontSize: '12px' }}>© 2026 HOSPI-INFO</div>
      </div>
    </div>
  );
}

export default HospitalDetail;