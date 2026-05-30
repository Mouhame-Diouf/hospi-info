import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://MouhaemedDiouf221.pythonanywhere.com';

function ConnexionUnique() {
  const [valeur, setValeur] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [typeDetecte, setTypeDetecte] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const isTelephone = (v) => /^[0-9]{9,}$/.test(v.replace(/\s/g, ''));
  const isEmail = (v) => v.includes('@');
  const isAdmin = (v) => v === 'superadmin2026';

  const detecterType = (v) => {
    setValeur(v);
    setErreur('');
    if (isAdmin(v)) {
      setTypeDetecte('admin');
    } else if (isEmail(v)) {
      setTypeDetecte('directeur');
    } else if (isTelephone(v)) {
      setTypeDetecte('medecin');
    } else {
      setTypeDetecte('');
    }
  };

  const connecter = async () => {
    if (!valeur.trim()) {
      setErreur('Veuillez saisir votre identifiant.'); return;
    }
    setLoading(true);
    setErreur('');
    try {
      if (typeDetecte === 'admin') {
        navigate('/super-admin');

      } else if (typeDetecte === 'directeur') {
        if (!motdepasse) { setErreur('Veuillez saisir votre mot de passe.'); setLoading(false); return; }
        const res = await axios.get(`${API}/api/hospitals/`);
        const hopital = res.data.find(
          h => h.email === valeur.trim() && h.password === motdepasse
        );
        if (hopital) {
          localStorage.setItem('hopital_connecte', JSON.stringify(hopital));
          navigate('/dashboard-hopital');
        } else {
          setErreur('Email ou mot de passe incorrect.');
        }

      } else if (typeDetecte === 'medecin') {
        const res = await axios.get(`${API}/api/hospitals/`);
        let medecinTrouve = null;
        let hopitalTrouve = null;
        for (const h of res.data) {
          const resM = await axios.get(`${API}/api/hospitals/${h.id}/medecins/`);
          const m = resM.data.find(med => med.telephone === valeur.trim());
          if (m) { medecinTrouve = m; hopitalTrouve = h; break; }
        }
        if (medecinTrouve) {
          localStorage.setItem('medecin_connecte', JSON.stringify(medecinTrouve));
          localStorage.setItem('hopital_medecin', JSON.stringify(hopitalTrouve));
          navigate('/dashboard-medecin');
        } else {
          setErreur('Numéro de téléphone non reconnu.');
        }
      } else {
        setErreur('Identifiant non reconnu. Entrez un email, un téléphone ou le code admin.');
      }
    } catch {
      setErreur('Erreur de connexion. Réessayez.');
    }
    setLoading(false);
  };

  const getBadge = () => {
    if (typeDetecte === 'directeur') return {
      icon: '🏥', label: 'DIRECTEUR D\'HÔPITAL',
      bg: '#f0fdf4', color: '#16a34a', border: '#16a34a'
    };
    if (typeDetecte === 'medecin') return {
      icon: '👨‍⚕️', label: 'MÉDECIN',
      bg: '#fffbeb', color: '#d97706', border: '#d97706'
    };
    if (typeDetecte === 'admin') return {
      icon: '⚙️', label: 'SUPER ADMINISTRATEUR',
      bg: '#f5f3ff', color: '#7c3aed', border: '#7c3aed'
    };
    return null;
  };

  const badge = getBadge();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif', padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '24px', padding: '32px',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏥</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
            HOSPI-INFO
          </div>
          <div style={{ color: '#6b7280', fontSize: '13px' }}>
            Espace Professionnel
          </div>
        </div>

        {/* RETOUR */}
        <button onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: '#6b7280',
            cursor: 'pointer', fontSize: '13px', marginBottom: '16px',
            padding: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
          ← Retour
        </button>

        {/* BADGE TYPE DÉTECTÉ */}
        {badge && (
          <div style={{
            background: badge.bg, border: `1px solid ${badge.border}`,
            borderRadius: '12px', padding: '12px',
            display: 'flex', alignItems: 'center',
            gap: '10px', marginBottom: '16px'
          }}>
            <span style={{ fontSize: '1.4rem' }}>{badge.icon}</span>
            <div>
              <div style={{ fontSize: '12px', color: badge.color, fontWeight: '800' }}>
                {badge.label}
              </div>
              <div style={{ fontSize: '13px', color: '#374151' }}>{valeur}</div>
            </div>
          </div>
        )}

        {/* CHAMP IDENTIFIANT */}
        <div style={{ marginBottom: '16px' }}>
          {!badge && (
            <div style={{ background: '#f0f7ff', borderRadius: '10px',
              padding: '12px', marginBottom: '12px',
              fontSize: '12px', color: '#1d4ed8' }}>
              💡 Email → Directeur &nbsp;|&nbsp;
              Téléphone → Médecin &nbsp;|&nbsp;
              Code → Admin
            </div>
          )}
          <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>
            Identifiant
          </label>
          <input
            placeholder="Email, téléphone ou code admin..."
            value={valeur}
            onChange={e => detecterType(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && connecter()}
            style={{ width: '100%', padding: '13px 14px',
              borderRadius: '12px', border: `2px solid ${badge ? badge.border : '#e2e8f0'}`,
              fontSize: '14px', marginTop: '6px', boxSizing: 'border-box',
              outline: 'none', background: '#f8fafc' }}
          />
        </div>

        {/* MOT DE PASSE — visible dès que email détecté */}
        {typeDetecte === 'directeur' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="Votre mot de passe..."
              value={motdepasse}
              onChange={e => { setMotdepasse(e.target.value); setErreur(''); }}
              onKeyPress={e => e.key === 'Enter' && connecter()}
              autoFocus
              style={{ width: '100%', padding: '13px 14px',
                borderRadius: '12px', border: '2px solid #16a34a',
                fontSize: '14px', marginTop: '6px', boxSizing: 'border-box',
                outline: 'none', background: '#f8fafc' }}
            />
          </div>
        )}

        {/* ERREUR */}
        {erreur && (
          <div style={{ background: '#fee2e2', color: '#dc2626',
            borderRadius: '10px', padding: '10px', fontSize: '13px',
            marginBottom: '12px', fontWeight: '600', textAlign: 'center' }}>
            ⚠️ {erreur}
          </div>
        )}

        {/* BOUTON SE CONNECTER */}
        <button onClick={connecter} disabled={loading}
          style={{ width: '100%', padding: '14px',
            background: loading ? '#94a3b8' :
              typeDetecte === 'directeur' ? '#16a34a' :
              typeDetecte === 'medecin' ? '#d97706' :
              typeDetecte === 'admin' ? '#7c3aed' : '#0f172a',
            color: 'white', border: 'none', borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700', fontSize: '15px' }}>
          {loading ? '⏳ Connexion...' : '✅ Se connecter'}
        </button>

        {/* LIEN INSCRIPTION */}
        <div style={{ textAlign: 'center', marginTop: '20px',
          paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <span style={{ color: '#6b7280', fontSize: '13px' }}>
            Nouvel hôpital ?{' '}
          </span>
          <span onClick={() => navigate('/inscription-hopital')}
            style={{ color: '#2563eb', fontWeight: '700',
              cursor: 'pointer', fontSize: '13px' }}>
            S'inscrire ici
          </span>
        </div>

      </div>
    </div>
  );
}

export default ConnexionUnique;