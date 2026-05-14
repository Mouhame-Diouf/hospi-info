import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://MouhaemedDiouf221.pythonanywhere.com';

function LoginMedecin() {
  const [telephone, setTelephone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const medecin = localStorage.getItem('medecin_connecte');
    if (medecin) navigate('/dashboard-medecin');
  }, [navigate]);

  const handleLogin = async () => {
    if (!telephone) {
      setError('Veuillez entrer votre numéro de téléphone.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Chercher tous les hôpitaux
      const res = await axios.get(`${API}/api/hospitals/`);
      const hospitals = res.data;

      let medecinTrouve = null;
      let hopitalTrouve = null;

      // Chercher le médecin par téléphone dans tous les hôpitaux
      for (const h of hospitals) {
        const resMedecins = await axios.get(`${API}/api/hospitals/${h.id}/medecins/`);
        const medecin = resMedecins.data.find(m =>
          m.telephone === telephone ||
          m.telephone === `+221${telephone}` ||
          m.telephone === telephone.replace('+221', '')
        );
        if (medecin) {
          medecinTrouve = medecin;
          hopitalTrouve = h;
          break;
        }
      }

      if (!medecinTrouve) {
        setError('Aucun médecin trouvé avec ce numéro. Contactez votre administrateur.');
        setLoading(false);
        return;
      }

      localStorage.setItem('medecin_connecte', JSON.stringify({
        id: medecinTrouve.id,
        nom: medecinTrouve.nom,
        specialite: medecinTrouve.specialite,
        disponible: medecinTrouve.disponible,
        heure_debut: medecinTrouve.heure_debut,
        heure_fin: medecinTrouve.heure_fin,
        jours_travail: medecinTrouve.jours_travail,
        hospital_id: hopitalTrouve.id,
        hospital_name: hopitalTrouve.name,
      }));
      navigate('/dashboard-medecin');

    } catch (err) {
      setError('Erreur de connexion. Réessayez.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '40px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>👨‍⚕️</div>
          <h1 style={{ color: '#0f172a', fontSize: '1.6rem',
            fontWeight: '800', marginBottom: '6px' }}>
            Espace Médecin
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Connectez-vous pour gérer votre disponibilité
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626',
            padding: '12px 16px', borderRadius: '12px',
            marginBottom: '20px', fontSize: '14px',
            textAlign: 'center', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: '#374151', fontSize: '14px', fontWeight: '700' }}>
            Numéro de téléphone
          </label>
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            <div style={{ padding: '14px', background: '#f0f7ff',
              borderRadius: '12px', border: '2px solid #e2e8f0',
              color: '#2563eb', fontWeight: '700' }}>
              🇸🇳 +221
            </div>
            <input
              type="tel"
              placeholder="77 000 00 00"
              value={telephone}
              onChange={e => setTelephone(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleLogin()}
              style={{ flex: 1, padding: '14px 16px', borderRadius: '12px',
                border: '2px solid #e2e8f0', fontSize: '15px',
                outline: 'none', background: '#f8fafc' }}
            />
          </div>
        </div>

        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', padding: '14px',
            background: loading ? '#94a3b8' :
              'linear-gradient(135deg, #0f172a, #2563eb)',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px' }}>
          {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/home')}
            style={{ background: 'none', border: 'none',
              color: '#6b7280', cursor: 'pointer', fontSize: '13px' }}>
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginMedecin;