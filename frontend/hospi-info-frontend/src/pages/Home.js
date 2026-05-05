import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MapView from '../components/MapView';

function Home() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState('');
  const [hopitalPlusProche, setHopitalPlusProche] = useState(null);
  const navigate = useNavigate();

  // Charger les hôpitaux toutes les 30 secondes
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

  // Trouver l'hôpital le plus proche
  useEffect(() => {
    if (navigator.geolocation && hospitals.length > 0) {
      navigator.geolocation.getCurrentPosition(pos => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        const distance = (lat1, lng1, lat2, lng2) => {
          const R = 6371;
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLng = (lng2 - lng1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
          return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        };

        const hopitauxDisponibles = hospitals.filter(h =>
          h.available_beds > 0 && h.latitude && h.longitude
        );

        if (hopitauxDisponibles.length > 0) {
          const plusProche = hopitauxDisponibles.reduce((prev, curr) => {
            const distPrev = distance(userLat, userLng, prev.latitude, prev.longitude);
            const distCurr = distance(userLat, userLng, curr.latitude, curr.longitude);
            return distCurr < distPrev ? curr : prev;
          });
          setHopitalPlusProche(plusProche);
        }
      });
    }
  }, [hospitals]);

  const filtered = hospitals.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  );

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
        <div style={{ padding: '60px 30px', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🏥</div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '10px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            HOSPI-INFO
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.95, marginBottom: '16px' }}>
            Disponibilité hospitalière en temps réel au Sénégal
          </p>

          {/* STATS RAPIDES */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px',
            marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              borderRadius: '12px', padding: '12px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>{hospitals.length}</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Hôpitaux</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              borderRadius: '12px', padding: '12px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>
                {hospitals.filter(h => h.available_beds > 0).length}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Disponibles</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              borderRadius: '12px', padding: '12px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '700' }}>
                {hospitals.reduce((acc, h) => acc + h.available_beds, 0)}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>Lits libres</div>
            </div>
          </div>

          {/* BOUTONS */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/stats')}
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.6)', color: 'white',
                padding: '10px 24px', borderRadius: '50px', cursor: 'pointer',
                fontSize: '15px', fontWeight: '500' }}>
              📊 Statistiques
            </button>
            <button onClick={() => navigate('/admin')}
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.6)', color: 'white',
                padding: '10px 24px', borderRadius: '50px', cursor: 'pointer',
                fontSize: '15px', fontWeight: '500' }}>
              ⚙️ Admin
            </button>
            <button onClick={() => navigate('/chat')}
              style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.6)', color: 'white',
                padding: '10px 24px', borderRadius: '50px', cursor: 'pointer',
                fontSize: '15px', fontWeight: '500' }}>
              🤖 Assistant
            </button>
          </div>
        </div>

        {/* HOPITAL LE PLUS PROCHE */}
        {hopitalPlusProche && (
          <div style={{ maxWidth: '750px', margin: '0 auto 20px', padding: '0 20px' }}>
            <div style={{ background: 'rgba(46,204,113,0.2)', border: '2px solid #2ecc71',
              borderRadius: '16px', padding: '20px', color: 'white' }}>
              <h3 style={{ marginBottom: '8px', fontSize: '1rem' }}>
                📍 Hôpital le plus proche de vous
              </h3>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>
                🏥 {hopitalPlusProche.name}
              </h2>
              <p style={{ opacity: 0.9, marginBottom: '12px' }}>
                📍 {hopitalPlusProche.city} — 🛏️ {hopitalPlusProche.available_beds} lits disponibles
              </p>
              <button
                onClick={() => navigate(`/hospital/${hopitalPlusProche.id}`)}
                style={{ background: '#2ecc71', color: 'white', border: 'none',
                  padding: '10px 24px', borderRadius: '50px', cursor: 'pointer',
                  fontWeight: '600', fontSize: '14px' }}>
                Voir les détails →
              </button>
            </div>
          </div>
        )}

        {/* CARTE */}
        <MapView hospitals={hospitals} />

        {/* RECHERCHE */}
        <div style={{ maxWidth: '750px', margin: '30px auto 0', padding: '0 20px' }}>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <span style={{ position: 'absolute', left: '16px', top: '50%',
              transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
            <input
              type="text"
              placeholder="Rechercher un hôpital ou une ville..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '50px',
                border: 'none', fontSize: '15px', outline: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                background: 'rgba(255,255,255,0.9)' }}
            />
          </div>

          {/* LISTE HOPITAUX */}
          {filtered.map(h => (
            <div key={h.id}
              onClick={() => navigate(`/hospital/${h.id}`)}
              style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', padding: '20px',
                marginBottom: '16px', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                borderLeft: `5px solid ${h.available_beds > 0 ? '#2ecc71' : '#e74c3c'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ color: '#1a3a6b', marginBottom: '6px', fontSize: '1.1rem' }}>
                    {h.name}
                  </h2>
                  <p style={{ color: '#888', fontSize: '14px' }}>📍 {h.city} — {h.address}</p>
                </div>
                <span style={{
                  padding: '5px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: '600',
                  background: h.available_beds > 0 ? '#eafaf1' : '#fdecea',
                  color: h.available_beds > 0 ? '#2ecc71' : '#e74c3c',
                  whiteSpace: 'nowrap'
                }}>
                  {h.available_beds > 0 ? '✅ Disponible' : '❌ Complet'}
                </span>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center', background: '#f0f7ff',
                  borderRadius: '10px', padding: '8px 16px' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1d72b8' }}>
                    {h.available_beds}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Lits disponibles</div>
                </div>
                <div style={{ textAlign: 'center', background: '#f0f7ff',
                  borderRadius: '10px', padding: '8px 16px' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#1d72b8' }}>
                    {h.total_beds}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Lits totaux</div>
                </div>
                <div style={{ textAlign: 'center', background: '#fff0f0',
                  borderRadius: '10px', padding: '8px 16px' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#e74c3c' }}>
                    {h.occupancy_rate}%
                  </div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Occupation</div>
                </div>
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
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>
                Mouhamed Diouf
              </div>
              <div style={{ opacity: 0.8, fontSize: '14px' }}>📞 +221 77 680 06 74</div>
              <div style={{ opacity: 0.8, fontSize: '14px' }}>✉️ Mouhamediouf776800@gmail.com</div>
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>
                Assietou Ndong
              </div>
              <div style={{ opacity: 0.8, fontSize: '14px' }}>Co-développeuse</div>
            </div>
          </div>
          <div style={{ opacity: 0.5, fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '20px' }}>
            © 2026 HOSPI-INFO — Tous droits réservés
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;