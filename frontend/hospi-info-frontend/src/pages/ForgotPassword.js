import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [telephone, setTelephone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const envoyerCode = async () => {
    if (!telephone) {
      setError('Veuillez entrer votre numéro de téléphone.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('https://MouhaemedDiouf221.pythonanywhere.com/api/envoyer-code/', { telephone });
      setSuccess(`✅ Code envoyé au +221 ${telephone}`);
      setTimeout(() => { setSuccess(''); setStep(2); }, 1500);
    } catch (err) {
      setError('Erreur lors de l\'envoi du SMS. Réessayez.');
    }
    setLoading(false);
  };

  const verifierCode = async () => {
    if (!code) {
      setError('Veuillez entrer le code reçu.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('https://MouhaemedDiouf221.pythonanywhere.com/api/verifier-code/', { telephone, code });
      setStep(3);
    } catch (err) {
      setError('Code incorrect. Vérifiez le SMS reçu.');
    }
    setLoading(false);
  };

  const changerMotDePasse = () => {
    if (!newPassword || !confirm) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (newPassword !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setSuccess('✅ Mot de passe modifié avec succès !');
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(/hospi-info.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(0,40,100,0.80) 0%, rgba(0,100,160,0.70) 100%)',
        zIndex: 0
      }}></div>

      <div style={{
        position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem' }}>🔐</div>
          <h1 style={{ color: '#1a3a6b', fontSize: '1.6rem', marginBottom: '6px' }}>
            Mot de passe oublié
          </h1>
          <p style={{ color: '#888', fontSize: '14px' }}>
            {step === 1 && 'Entrez votre numéro de téléphone'}
            {step === 2 && 'Entrez le code reçu par SMS'}
            {step === 3 && 'Créez un nouveau mot de passe'}
          </p>
        </div>

        {/* ETAPES */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '30px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: step >= s ? '#1d72b8' : '#e0e8f0',
              color: step >= s ? 'white' : '#aaa',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '14px'
            }}>{s}</div>
          ))}
        </div>

        {error && (
          <div style={{ background: '#fdecea', color: '#e74c3c', padding: '12px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#eafaf1', color: '#2ecc71', padding: '12px',
            borderRadius: '10px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {success}
          </div>
        )}

        {/* ETAPE 1 */}
        {step === 1 && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>
                Numéro de téléphone
              </label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <div style={{ padding: '12px', background: '#f0f7ff', borderRadius: '10px',
                  border: '2px solid #e0e8f0', color: '#1d72b8', fontWeight: '600' }}>
                  🇸🇳 +221
                </div>
                <input
                  type="tel"
                  placeholder="77 000 00 00"
                  value={telephone}
                  onChange={e => setTelephone(e.target.value.replace(/\s/g, ''))}
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '10px',
                    border: '2px solid #e0e8f0', fontSize: '15px', outline: 'none' }}
                />
              </div>
            </div>

            <button onClick={envoyerCode} disabled={loading}
              style={{ width: '100%', padding: '14px',
                background: loading ? '#aaa' : '#1d72b8',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '16px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Envoi en cours...' : '📱 Envoyer le code SMS →'}
            </button>
          </>
        )}

        {/* ETAPE 2 */}
        {step === 2 && (
          <>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
              Code envoyé au <strong>+221 {telephone}</strong>
            </p>
            <input
              type="text"
              placeholder="Entrez le code SMS"
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '10px',
                border: '2px solid #e0e8f0', fontSize: '24px', marginBottom: '24px',
                outline: 'none', boxSizing: 'border-box', textAlign: 'center',
                letterSpacing: '8px', fontWeight: '700' }}
            />
            <button onClick={verifierCode} disabled={loading}
              style={{ width: '100%', padding: '14px',
                background: loading ? '#aaa' : '#1d72b8',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '16px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Vérification...' : 'Vérifier le code →'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <span onClick={() => setStep(1)}
                style={{ color: '#1d72b8', cursor: 'pointer', fontSize: '13px' }}>
                ← Retour
              </span>
            </div>
          </>
        )}

        {/* ETAPE 3 */}
        {step === 3 && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>
                Nouveau mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
                  outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: '#555', fontSize: '14px', fontWeight: '600' }}>
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px',
                  border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
                  outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button onClick={changerMotDePasse}
              style={{ width: '100%', padding: '14px', background: '#2ecc71',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              ✅ Enregistrer le nouveau mot de passe
            </button>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span onClick={() => navigate('/login')}
            style={{ color: '#888', cursor: 'pointer', fontSize: '13px' }}>
            ← Retour à la connexion
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;