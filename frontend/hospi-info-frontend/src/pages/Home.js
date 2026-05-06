import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MapView from '../components/MapView';

function Home() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState('');
  const [hopitalPlusProche, setHopitalPlusProche] = useState(null);
  const [filtre, setFiltre] = useState('tous');
  const [activeTab, setActiveTab] = useState('accueil');
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

  useEffect(() => {
    if (!navigator.geolocation || hospitals.length === 0) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const userLat = pos.coords.latitude;
      const userLng = pos.coords.longitude;
      const calcDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLng/2) * Math.sin(dLng/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      };
      const dispo = hospitals.filter(h => h.available_beds > 0 && h.latitude && h.longitude);
      if (dispo.length > 0) {
        const plusProche = dispo.reduce((prev, curr) => {
          const d1 = calcDistance(userLat, userLng, curr.latitude, curr.longitude);
          const d2 = calcDistance(userLat, userLng, prev.latitude, prev.longitude);
          return d1 < d2 ? curr : prev;
        });
        setHopitalPlusProche(plusProche);
      }
    });
  }, [hospitals]);

  const categories = [
    { id: 'tous', label: 'Tous', icon: '🏥' },
    { id: 'urgences', label: 'Urgences', icon: '🚨' },
    { id: 'maternité', label: 'Maternité', icon: '🤱' },
    { id: 'pédiatrie', label: 'Pédiatrie', icon: '👶' },
    { id: 'chirurgie', label: 'Chirurgie', icon: '🔬' },
    { id: 'cardiologie', label: 'Cardio', icon: '❤️' },
  ];

  const filtered = hospitals.filter(h => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase());
    if (filtre === 'tous') return matchSearch;
    return matchSearch && h.services && h.services.some(s =>
      s.name.toLowerCase().includes(filtre) && s.available
    );
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8',
      fontFamily: 'Segoe UI, sans-serif', paddingBottom: '80px' }}>

      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        padding: '20px 20px 30px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ color: 'white', fontWeight: '800', fontSize: '1.4rem',
              letterSpacing: '-0.5px' }}>
              🏥 HOSPI-INFO
            </div>
            <div style={{ color: '#4ade80', fontSize: '11px', fontWeight: '600' }}>
              ● Mise à jour en temps réel
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigate('/chat')}
              style={{ background: '#2563eb', color: 'white', border: 'none',
                padding: '8px 16px', borderRadius: '50px', cursor: 'pointer',
                fontSize: '13px', fontWeight: '700' }}>
              🤖 Assistant
            </button>
          </div>
        </div>

        {/* BARRE RECHERCHE */}
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%',
            transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher un hôpital, ville, service..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '14px 16px 14px 44px',
              borderRadius: '50px', border: 'none', fontSize: '14px',
              outline: 'none', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.15)',
              color: 'white', backdropFilter: 'blur(10px)' }}
          />
        </div>
      </div>

      {/* HOPITAL LE PLUS PROCHE */}
      {hopitalPlusProche && (
        <div style={{ margin: '16px', borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(37,99,235,0.3)' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            padding: '20px', color: 'white'
          }}>
            <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px',
              fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
              📍 Plus proche de vous
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '12px' }}>
              {hopitalPlusProche.name}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50px',
                padding: '6px 14px', fontSize: '13px', fontWeight: '700' }}>
                🛏️ {hopitalPlusProche.available_beds} lits libres
              </div>
              <button onClick={() => navigate(`/hospital/${hopitalPlusProche.id}`)}
                style={{ background: 'white', color: '#2563eb', border: 'none',
                  padding: '8px 20px', borderRadius: '50px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: '800' }}>
                Voir →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px', margin: '0 16px 16px' }}>
        {[
          { label: 'Hôpitaux', value: hospitals.length, color: '#2563eb', bg: '#eff6ff', icon: '🏥' },
          { label: 'Disponibles', value: hospitals.filter(h => h.available_beds > 0).length, color: '#16a34a', bg: '#f0fdf4', icon: '✅' },
          { label: 'Lits libres', value: hospitals.reduce((acc, h) => acc + h.available_beds, 0), color: '#d97706', bg: '#fefce8', icon: '🛏️' },
          { label: 'Complets', value: hospitals.filter(h => h.available_beds === 0).length, color: '#dc2626', bg: '#fef2f2', icon: '❌' },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, borderRadius: '16px',
            padding: '12px', textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '1.1rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '600' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* CARTE */}
{activeTab === 'carte' && (
  <div style={{ margin: '0 16px 16px', borderRadius: '20px',
    overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
    <MapView hospitals={hospitals} />
  </div>
)}

      {/* FILTRES */}
      <div style={{ padding: '0 16px 12px', display: 'flex',
        gap: '8px', overflowX: 'auto' }}>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setFiltre(cat.id)}
            style={{
              padding: '8px 16px', borderRadius: '50px', cursor: 'pointer',
              border: 'none', fontSize: '13px', fontWeight: '700',
              whiteSpace: 'nowrap',
              background: filtre === cat.id ?
                'linear-gradient(135deg, #0f172a, #2563eb)' : 'white',
              color: filtre === cat.id ? 'white' : '#374151',
              boxShadow: filtre === cat.id ?
                '0 4px 15px rgba(37,99,235,0.4)' : '0 2px 8px rgba(0,0,0,0.08)'
            }}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* TITRE SECTION */}
      <div style={{ padding: '0 16px 12px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>
          Hôpitaux ({filtered.length})
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Mis à jour il y a quelques secondes
        </div>
      </div>

      {/* LISTE HÔPITAUX */}
      <div style={{ padding: '0 16px' }}>
        {filtered.map(h => (
          <div key={h.id}
            onClick={() => navigate(`/hospital/${h.id}`)}
            style={{
              background: 'white', borderRadius: '20px', padding: '20px',
              marginBottom: '12px', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f1f5f9',
              transition: 'all 0.2s'
            }}>

            {/* En-tête */}
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
                  marginBottom: '4px' }}>
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: h.available_beds > 0 ? '#22c55e' : '#ef4444',
                    boxShadow: h.available_beds > 0 ?
                      '0 0 0 3px rgba(34,197,94,0.2)' : '0 0 0 3px rgba(239,68,68,0.2)'
                  }}></div>
                  <span style={{ fontSize: '11px', fontWeight: '700',
                    color: h.available_beds > 0 ? '#16a34a' : '#dc2626' }}>
                    {h.available_beds > 0 ? 'DISPONIBLE' : 'COMPLET'}
                  </span>
                </div>
                <h3 style={{ color: '#0f172a', fontSize: '1rem',
                  fontWeight: '800', marginBottom: '4px' }}>
                  {h.name}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>
                  📍 {h.city} {h.address && `· ${h.address}`}
                </p>
              </div>
            </div>

            {/* STATS LITS */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px',
                padding: '10px', textAlign: 'center',
                borderLeft: '3px solid #2563eb' }}>
                <div style={{ fontWeight: '800', color: '#2563eb', fontSize: '1.3rem' }}>
                  {h.available_beds}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>
                  LITS LIBRES
                </div>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px',
                padding: '10px', textAlign: 'center',
                borderLeft: '3px solid #94a3b8' }}>
                <div style={{ fontWeight: '800', color: '#475569', fontSize: '1.3rem' }}>
                  {h.total_beds}
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>
                  TOTAL
                </div>
              </div>
              <div style={{ flex: 1, background: '#f8fafc', borderRadius: '12px',
                padding: '10px', textAlign: 'center',
                borderLeft: `3px solid ${h.occupancy_rate > 80 ? '#ef4444' : '#22c55e'}` }}>
                <div style={{ fontWeight: '800', fontSize: '1.3rem',
                  color: h.occupancy_rate > 80 ? '#dc2626' : '#16a34a' }}>
                  {h.occupancy_rate}%
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>
                  OCCUPATION
                </div>
              </div>
            </div>

            {/* BARRE */}
            <div style={{ background: '#f1f5f9', borderRadius: '50px',
              height: '6px', marginBottom: '14px' }}>
              <div style={{
                background: h.occupancy_rate > 80 ? '#ef4444' :
                  h.occupancy_rate > 60 ? '#f59e0b' : '#22c55e',
                borderRadius: '50px', height: '6px',
                width: `${h.occupancy_rate}%`
              }}></div>
            </div>

            {/* SERVICES */}
            {h.services && h.services.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {h.services.slice(0, 4).map(s => (
                  <span key={s.id} style={{
                    padding: '4px 10px', borderRadius: '50px',
                    fontSize: '11px', fontWeight: '700',
                    background: s.available ? '#dcfce7' : '#fee2e2',
                    color: s.available ? '#15803d' : '#b91c1c'
                  }}>
                    {s.available ? '✅' : '❌'} {s.name}
                  </span>
                ))}
                {h.services.length > 4 && (
                  <span style={{ padding: '4px 10px', borderRadius: '50px',
                    fontSize: '11px', fontWeight: '700',
                    background: '#f1f5f9', color: '#64748b' }}>
                    +{h.services.length - 4} autres
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* NAVIGATION BAS */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e2e8f0',
        display: 'flex', justifyContent: 'space-around',
        padding: '10px 0 20px', zIndex: 100,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)'
      }}>
        {[
  { id: 'accueil', icon: '🏥', label: 'Accueil', action: () => setActiveTab('accueil') },
  { id: 'carte', icon: '🗺️', label: 'Carte', action: () => setActiveTab('carte') },
  { id: 'rdv', icon: '📋', label: 'Mes RDV', action: () => navigate('/mes-rendezvous') },
  { id: 'chat', icon: '🤖', label: 'Assistant', action: () => navigate('/chat') },
  { id: 'stats', icon: '📊', label: 'Stats', action: () => navigate('/stats') },
].map(tab => (
          <button key={tab.id} onClick={tab.action}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '4px', padding: '4px 12px',
              color: activeTab === tab.id ? '#2563eb' : '#94a3b8' }}>
            <span style={{ fontSize: '1.4rem' }}>{tab.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: '700',
              color: activeTab === tab.id ? '#2563eb' : '#94a3b8' }}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <div style={{ background: '#0f172a', color: 'white',
        padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '4px' }}>
          🏥 HOSPI-INFO
        </div>
        <div style={{ opacity: 0.5, fontSize: '11px' }}>
          © 2026 — Génie Informatique — Mouhamed Diouf & Assietou Ndong
        </div>
      </div>

    </div>
  );
}

export default Home;