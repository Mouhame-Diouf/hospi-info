import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Stats() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const chargerStats = () => {
      axios.get('https://MouhaemedDiouf221.pythonanywhere.com/api/stats/')
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    };

    chargerStats();
    const interval = setInterval(chargerStats, 30000);

    return () => clearInterval(interval);
  }, []);

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
            📊 Statistiques
          </h1>
          <p style={{ opacity: 0.9 }}>Vue globale du réseau hospitalier</p>
        </div>

        {/* STATS */}
        <div style={{ maxWidth: '750px', margin: '0 auto', padding: '0 20px' }}>
          {!stats ? (
            <p style={{ textAlign: 'center', padding: '50px', color: 'white' }}>Chargement...</p>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', padding: '24px',
                  textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  borderTop: '4px solid #1d72b8' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1d72b8' }}>
                    {stats.total_hospitals}
                  </div>
                  <div style={{ color: '#888', marginTop: '8px' }}>🏥 Hôpitaux</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', padding: '24px',
                  textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  borderTop: '4px solid #2ecc71' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2ecc71' }}>
                    {stats.available_beds}
                  </div>
                  <div style={{ color: '#888', marginTop: '8px' }}>🛏️ Lits disponibles</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', padding: '24px',
                  textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  borderTop: '4px solid #e67e22' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#e67e22' }}>
                    {stats.total_beds}
                  </div>
                  <div style={{ color: '#888', marginTop: '8px' }}>🏨 Lits totaux</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', padding: '24px',
                  textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  borderTop: '4px solid #e74c3c' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#e74c3c' }}>
                    {stats.full_hospitals}
                  </div>
                  <div style={{ color: '#888', marginTop: '8px' }}>❌ Hôpitaux complets</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '16px', padding: '24px',
                textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                borderTop: '4px solid #1d72b8' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1d72b8' }}>
                  {stats.occupancy_rate}%
                </div>
                <div style={{ color: '#888', marginTop: '8px', marginBottom: '16px' }}>
                  📈 Taux d'occupation global
                </div>
                <div style={{ background: '#f0f4f8', borderRadius: '10px', height: '14px' }}>
                  <div style={{ background: 'linear-gradient(90deg, #1d72b8, #2ecc71)',
                    borderRadius: '10px', height: '14px',
                    width: `${stats.occupancy_rate}%` }}></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div style={{ background: 'rgba(0,20,60,0.85)', color: 'white', marginTop: '40px',
          padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ marginBottom: '20px', opacity: 0.8, fontSize: '14px' }}>
            Projet de fin d'études — Génie Informatique 2026
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '8px' }}>Mouhamed Diouf</div>
              <div style={{ opacity: 0.8, fontSize: '14px' }}>📞 +221 77 680 06 74</div>
              <div style={{ opacity: 0.8, fontSize: '14px' }}>✉️ Mouhamediouf776800@gmail.com</div>
            </div>
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

export default Stats;