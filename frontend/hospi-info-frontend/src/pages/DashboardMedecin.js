import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://MouhaemedDiouf221.pythonanywhere.com';

function DashboardMedecin() {
  const [medecin, setMedecin] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const medecinData = localStorage.getItem('medecin_connecte');
    if (!medecinData) { navigate('/login-medecin'); return; }
    setMedecin(JSON.parse(medecinData));
  }, [navigate]);

  const toggleDisponibilite = async () => {
    setLoading(true);
    try {
      await axios.patch(`${API}/api/medecins/${medecin.id}/`,
        { disponible: !medecin.disponible });
      const updated = { ...medecin, disponible: !medecin.disponible };
      setMedecin(updated);
      localStorage.setItem('medecin_connecte', JSON.stringify(updated));
      setMessage(updated.disponible ?
        '✅ Vous êtes maintenant disponible !' :
        '❌ Vous êtes maintenant absent.');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Erreur. Réessayez.');
    }
    setLoading(false);
  };

  const deconnecter = () => {
    localStorage.removeItem('medecin_connecte');
    navigate('/login-medecin');
  };

  if (!medecin) return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Segoe UI' }}>
      ⏳ Chargement...
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8',
      fontFamily: 'Segoe UI, sans-serif' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
        padding: '16px 20px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem' }}>
            👨‍⚕️ {medecin.nom}
          </div>
          <div style={{ color: '#4ade80', fontSize: '11px', fontWeight: '600' }}>
            ● {medecin.hospital_name}
          </div>
        </div>
        <button onClick={deconnecter}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', padding: '8px 16px', borderRadius: '50px',
            cursor: 'pointer', fontSize: '13px' }}>
          Déconnexion
        </button>
      </div>

      <div style={{ padding: '20px' }}>

        {/* MESSAGE */}
        {message && (
          <div style={{ padding: '14px', borderRadius: '12px',
            marginBottom: '16px',
            background: message.includes('✅') ? '#dcfce7' : '#fee2e2',
            color: message.includes('✅') ? '#16a34a' : '#dc2626',
            fontWeight: '700', textAlign: 'center' }}>
            {message}
          </div>
        )}

        {/* CARTE PROFIL */}
        <div style={{ background: 'white', borderRadius: '20px',
          padding: '24px', marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%',
            background: medecin.disponible ? '#dcfce7' : '#fee2e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', margin: '0 auto 16px' }}>
            👨‍⚕️
          </div>
          <h2 style={{ color: '#0f172a', fontSize: '1.3rem',
            fontWeight: '800', marginBottom: '4px' }}>
            {medecin.nom}
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
            {medecin.specialite}
          </p>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>
            🏥 {medecin.hospital_name}
          </p>

          {/* STATUT */}
          <div style={{
            display: 'inline-block',
            padding: '8px 24px', borderRadius: '50px',
            background: medecin.disponible ? '#dcfce7' : '#fee2e2',
            color: medecin.disponible ? '#16a34a' : '#dc2626',
            fontWeight: '800', fontSize: '16px', marginBottom: '8px'
          }}>
            {medecin.disponible ? '🟢 Disponible' : '🔴 Absent'}
          </div>
        </div>

        {/* HORAIRES */}
        <div style={{ background: 'white', borderRadius: '20px',
          padding: '20px', marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#0f172a', marginBottom: '16px', fontSize: '1rem' }}>
            🕐 Mes horaires
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '12px' }}>
            <div style={{ background: '#f0f7ff', borderRadius: '12px',
              padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#6b7280',
                fontWeight: '700', marginBottom: '4px' }}>DÉBUT</div>
              <div style={{ fontWeight: '800', color: '#2563eb', fontSize: '1.3rem' }}>
                {medecin.heure_debut}
              </div>
            </div>
            <div style={{ background: '#f0f7ff', borderRadius: '12px',
              padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#6b7280',
                fontWeight: '700', marginBottom: '4px' }}>FIN</div>
              <div style={{ fontWeight: '800', color: '#2563eb', fontSize: '1.3rem' }}>
                {medecin.heure_fin}
              </div>
            </div>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: '12px',
            padding: '14px', marginTop: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#6b7280',
              fontWeight: '700', marginBottom: '4px' }}>JOURS DE TRAVAIL</div>
            <div style={{ fontWeight: '800', color: '#0f172a' }}>
              📅 {medecin.jours_travail}
            </div>
          </div>
        </div>

        {/* BOUTON DISPONIBILITÉ */}
        <button onClick={toggleDisponibilite} disabled={loading}
          style={{ width: '100%', padding: '20px',
            background: medecin.disponible ?
              'linear-gradient(135deg, #dc2626, #ef4444)' :
              'linear-gradient(135deg, #16a34a, #22c55e)',
            color: 'white', border: 'none', borderRadius: '20px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '800', fontSize: '18px',
            boxShadow: medecin.disponible ?
              '0 8px 25px rgba(220,38,38,0.4)' :
              '0 8px 25px rgba(22,163,74,0.4)',
            marginBottom: '12px' }}>
          {loading ? '⏳ Mise à jour...' :
            medecin.disponible ?
              '🔴 Me marquer comme absent' :
              '🟢 Me marquer comme disponible'}
        </button>

        <div style={{ background: '#fef3c7', borderRadius: '16px',
          padding: '14px', textAlign: 'center' }}>
          <div style={{ color: '#92400e', fontSize: '13px', fontWeight: '600' }}>
            💡 Les patients verront votre disponibilité en temps réel
          </div>
        </div>

      </div>
    </div>
  );
}

export default DashboardMedecin;