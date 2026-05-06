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

  if (!hospital) return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Segoe UI' }}>
      Chargement...
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* HEADER */}
      <div style={{ background: '#1a1a2e', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate('/home')}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer' }}>
          ⬅
        </button>
        <div style={{ fontSize: '2rem' }}>🏥</div>
        <div>
          <div style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
            {hospital.name}
          </div>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>📍 {hospital.city}</div>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>

        {/* STATUS */}
        <div style={{
          background: hospital.available_beds > 0 ? '#dcfce7' : '#fee2e2',
          border: `2px solid ${hospital.available_beds > 0 ? '#16a34a' : '#dc2626'}`,
          borderRadius: '16px', padding: '16px', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{ fontSize: '2rem' }}>
            {hospital.available_beds > 0 ? '✅' : '❌'}
          </div>
          <div>
            <div style={{ fontWeight: '700',
              color: hospital.available_beds > 0 ? '#16a34a' : '#dc2626', fontSize: '1rem' }}>
              {hospital.available_beds > 0 ? 'Hôpital disponible' : 'Hôpital complet'}
            </div>
            <div style={{ color: '#6b7280', fontSize: '13px' }}>
              {hospital.available_beds} lits libres sur {hospital.total_beds} au total
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px',
            textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderTop: '3px solid #2563eb' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2563eb' }}>
              {hospital.available_beds}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Lits libres</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px',
            textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderTop: '3px solid #6b7280' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#374151' }}>
              {hospital.total_beds}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Lits totaux</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px',
            textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderTop: `3px solid ${hospital.occupancy_rate > 80 ? '#dc2626' : '#16a34a'}` }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800',
              color: hospital.occupancy_rate > 80 ? '#dc2626' : '#16a34a' }}>
              {hospital.occupancy_rate}%
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Occupation</div>
          </div>
        </div>

        {/* BARRE OCCUPATION */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px',
          marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: '700', color: '#1a1a2e', fontSize: '14px' }}>
              Taux d'occupation
            </span>
            <span style={{ fontSize: '14px', fontWeight: '700',
              color: hospital.occupancy_rate > 80 ? '#dc2626' : '#16a34a' }}>
              {hospital.occupancy_rate}%
            </span>
          </div>
          <div style={{ background: '#f3f4f6', borderRadius: '50px', height: '10px' }}>
            <div style={{
              background: hospital.occupancy_rate > 80 ? '#dc2626' :
                hospital.occupancy_rate > 60 ? '#f59e0b' : '#16a34a',
              borderRadius: '50px', height: '10px',
              width: `${hospital.occupancy_rate}%`,
              transition: 'width 0.5s'
            }}></div>
          </div>
        </div>

        {/* INFORMATIONS */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px',
          marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1a1a2e', marginBottom: '16px', fontSize: '1rem' }}>
            📋 Informations
          </h3>
          {hospital.address && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px',
              alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>📍</span>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Adresse</div>
                <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>
                  {hospital.address}
                </div>
              </div>
            </div>
          )}
          {hospital.phone && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px',
              alignItems: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>📞</span>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Téléphone</div>
                <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>
                  {hospital.phone}
                </div>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '1.2rem' }}>🏙️</span>
            <div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Ville</div>
              <div style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>
                {hospital.city}
              </div>
            </div>
          </div>
        </div>

        {/* SERVICES CLIQUABLES */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px',
          marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#1a1a2e', marginBottom: '16px', fontSize: '1rem' }}>
            ⚕️ Services médicaux
          </h3>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '12px' }}>
            Cliquez sur un service pour voir les horaires et médecins disponibles
          </p>
          {hospital.services.length === 0 && (
            <p style={{ color: '#9ca3af' }}>Aucun service enregistré.</p>
          )}
          {hospital.services.map(s => (
            <div key={s.id}
              onClick={() => navigate(`/hospital/${hospital.id}/service/${encodeURIComponent(s.name)}`)}
              style={{
                padding: '14px 16px', marginBottom: '8px', borderRadius: '12px',
                background: s.available ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${s.available ? '#bbf7d0' : '#fecaca'}`,
                cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'all 0.2s'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.3rem' }}>
                  {s.name.toLowerCase().includes('urgence') ? '🚨' :
                   s.name.toLowerCase().includes('maternité') ? '🤱' :
                   s.name.toLowerCase().includes('pédiatrie') ? '👶' :
                   s.name.toLowerCase().includes('chirurgie') ? '🔪' :
                   s.name.toLowerCase().includes('cardiologie') ? '❤️' :
                   s.name.toLowerCase().includes('neurologie') ? '🧠' :
                   s.name.toLowerCase().includes('radiologie') ? '🩻' :
                   s.name.toLowerCase().includes('psychiatrie') ? '🧘' :
                   s.name.toLowerCase().includes('dermatologie') ? '🧴' : '🏥'}
                </span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '14px',
                    color: s.available ? '#16a34a' : '#dc2626' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    {s.available ? '✅ Disponible — Cliquez pour les détails' : '❌ Indisponible'}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '16px', color: '#9ca3af' }}>→</span>
            </div>
          ))}
        </div>
          <button
              onClick={() => navigate(`/rendezvous/${hospital.id}`)}
                style={{ width: '100%', padding: '16px',
                 background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                 color: 'white', border: 'none', borderRadius: '16px',
                 cursor: 'pointer', fontWeight: '700', fontSize: '16px',
                marginBottom: '12px' }}>
           📅 Prendre un rendez-vous
          </button>
        {/* BOUTON APPELER */}
        {hospital.phone && (
          <button
            onClick={() => window.open(`tel:${hospital.phone}`)}
            style={{ width: '100%', padding: '16px', background: '#1a1a2e',
              color: 'white', border: 'none', borderRadius: '16px',
              cursor: 'pointer', fontWeight: '700', fontSize: '16px',
              marginBottom: '16px' }}>
            📞 Appeler l'hôpital
          </button>
        )}

        {/* BOUTON TRAJET */}
        {hospital.latitude && hospital.longitude && (
          <button
            onClick={() => {
              navigator.geolocation.getCurrentPosition(pos => {
                const url = `https://www.google.com/maps/dir/${pos.coords.latitude},${pos.coords.longitude}/${hospital.latitude},${hospital.longitude}`;
                window.open(url, '_blank');
              });
            }}
            style={{ width: '100%', padding: '16px', background: '#2563eb',
              color: 'white', border: 'none', borderRadius: '16px',
              cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}>
            🗺️ Obtenir l'itinéraire
          </button>
        )}

      </div>
    </div>
  );
}

export default HospitalDetail;