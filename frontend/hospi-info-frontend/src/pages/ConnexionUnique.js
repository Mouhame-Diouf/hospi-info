import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://MouhaemedDiouf221.pythonanywhere.com';

function ConnexionUnique() {
  const [valeur, setValeur] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [etape, setEtape] = useState(1);
  const [typeDetecte, setTypeDetecte] = useState('');
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const istelephone = (v) => /^[0-9]{9,}$/.test(v.replace(/\s/g, ''));
  const isEmail = (v) => v.includes('@');
  const isSuperAdmin = (v) => v === 'superadmin2026';

  const detecterType = () => {
    const v = valeur.trim();
    if (!v) { setErreur('Veuillez saisir votre identifiant.'); return; }
    setErreur('');
    if (isSuperAdmin(v)) {
      navigate('/super-admin');
    } else if (isEmail(v)) {
      setTypeDetecte('directeur');
      setEtape(2);
    } else if (istelephone(v)) {
      setTypeDetecte('medecin');
      setEtape(2);
    } else {
      setErreur('Identifiant non reconnu. Entrez un email, un téléphone ou le code admin.');
    }
  };

  const connecter = async () => {
    setLoading(true);
    setErreur('');
    try {
      if (typeDetecte === 'directeur') {
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
      }
    } catch {
      setErreur('Erreur de connexion. Réessayez.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif', padding: '20px' }}>

      <div style={{ background: 'white', borderRadius: '24px', padding: '32px',
        width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🏥</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>
            HOSPI-INFO
          </div>
          <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
            Espace Professionnel
          </div>
        </div>

        {/* ÉTAPE 1 : SAISIR IDENTIFIANT */}
        {etape === 1 && (
          <div>
            <div style={{ background: '#f0f7ff', borderRadius: '12px',
              padding: '14px', marginBottom: '20px', fontSize: '13px', color: '#1d4ed8' }}>
              💡 Entrez votre <strong>email</strong> (directeur),
              votre <strong>téléphone</strong> (médecin)
              ou le <strong>code admin</strong>
            </div>

            <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>
              Identifiant
            </label>
            <input
              placeholder="Email, téléphone ou code admin..."
              value={valeur}
              onChange={e => { setValeur(e.target.value); setErreur(''); }}
              onKeyPress={e => e.key === 'Enter' && detecterType()}
              style={{ width: '100%', padding: '14px', borderRadius: '12px',
                border: '2px solid #e2e8f0', fontSize: '15px', marginTop: '6px',
                boxSizing: 'border-box', outline: 'none', marginBottom: '16px' }}
            />

            {erreur && (
              <div style={{ background: '#fee2e2', color: '#dc2626',
                borderRadius: '10px', padding: '10px', fontSize: '13px',
                marginBottom: '12px', fontWeight: '600' }}>
                ⚠️ {erreur}
              </div>
            )}

            <button onClick={detecterType}
              style={{ width: '100%', padding: '14px', background: '#0f172a',
                color: 'white', border: 'none', borderRadius: '12px',
                cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
              Continuer →
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : MOT DE PASSE (directeur uniquement) */}
        {etape === 2 && typeDetecte === 'directeur' && (
          <div>
            <button onClick={() => { setEtape(1); setErreur(''); }}
              style={{ background: 'none', border: 'none', color: '#6b7280',
                cursor: 'pointer', fontSize: '13px', marginBottom: '16px',
                padding: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ← Retour
            </button>

            <div style={{ background: '#f0fdf4', borderRadius: '12px',
              padding: '12px', marginBottom: '20px', display: 'flex',
              alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🏥</span>
              <div>
                <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700' }}>
                  DIRECTEUR D'HÔPITAL
                </div>
                <div style={{ fontSize: '13px', color: '#374151' }}>{valeur}</div>
              </div>
            </div>

            <label style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="Votre mot de passe..."
              value={motdepasse}
              onChange={e => { setMotdepasse(e.target.value); setErreur(''); }}
              onKeyPress={e => e.key === 'Enter' && connecter()}
              style={{ width: '100%', padding: '14px', borderRadius: '12px',
                border: '2px solid #e2e8f0', fontSize: '15px', marginTop: '6px',
                boxSizing: 'border-box', outline: 'none', marginBottom: '16px' }}
            />

            {erreur && (
              <div style={{ background: '#fee2e2', color: '#dc2626',
                borderRadius: '10px', padding: '10px', fontSize: '13px',
                marginBottom: '12px', fontWeight: '600' }}>
                ⚠️ {erreur}
              </div>
            )}

            <button onClick={connecter} disabled={loading}
              style={{ width: '100%', padding: '14px',
                background: loading ? '#94a3b8' : '#16a34a',
                color: 'white', border: 'none', borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '700', fontSize: '15px' }}>
              {loading ? '⏳ Connexion...' : '✅ Se connecter'}
            </button>
          </div>
        )}

        {/* ÉTAPE 2 : MÉDECIN (connexion directe) */}
        {etape === 2 && typeDetecte === 'medecin' && (
          <div>
            <button onClick={() => { setEtape(1); setErreur(''); }}
              style={{ background: 'none', border: 'none', color: '#6b7280',
                cursor: 'pointer', fontSize: '13px', marginBottom: '16px',
                padding: '0', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ← Retour
            </button>

            <div style={{ background: '#fffbeb', borderRadius: '12px',
              padding: '12px', marginBottom: '20px', display: 'flex',
              alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>👨‍⚕️</span>
              <div>
                <div style={{ fontSize: '12px', color: '#d97706', fontWeight: '700' }}>
                  MÉDECIN
                </div>
                <div style={{ fontSize: '13px', color: '#374151' }}>{valeur}</div>
              </div>
            </div>

            {erreur && (
              <div style={{ background: '#fee2e2', color: '#dc2626',
                borderRadius: '10px', padding: '10px', fontSize: '13px',
                marginBottom: '12px', fontWeight: '600' }}>
                ⚠️ {erreur}
              </div>
            )}

            <button onClick={connecter} disabled={loading}
              style={{ width: '100%', padding: '14px',
                background: loading ? '#94a3b8' : '#d97706',
                color: 'white', border: 'none', borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '700', fontSize: '15px' }}>
              {loading ? '⏳ Vérification...' : '✅ Se connecter'}
            </button>
          </div>
        )}

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