import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function InscriptionHopital() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nom: '', ville: '', adresse: '', telephone: '',
    email: '', totalLits: '', services: [],
    responsable: '', motdepasse: '', confirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const servicesDisponibles = [
    'Urgences', 'Maternité', 'Pédiatrie', 'Chirurgie',
    'Cardiologie', 'Neurologie', 'Psychiatrie', 'Radiologie',
    'Réanimation', 'Dermatologie'
  ];

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleService = service => {
    if (form.services.includes(service)) {
      setForm({ ...form, services: form.services.filter(s => s !== service) });
    } else {
      setForm({ ...form, services: [...form.services, service] });
    }
  };

  const etape1 = () => {
    if (!form.nom || !form.ville || !form.adresse || !form.telephone || !form.email) {
      setError('Veuillez remplir tous les champs.'); return;
    }
    setError(''); setStep(2);
  };

  const etape2 = () => {
    if (!form.totalLits || form.services.length === 0) {
      setError('Veuillez entrer le nombre de lits et sélectionner au moins un service.'); return;
    }
    setError(''); setStep(3);
  };

  const soumettre = async () => {
    if (!form.responsable || !form.motdepasse || !form.confirm) {
      setError('Veuillez remplir tous les champs.'); return;
    }
    if (form.motdepasse.length < 6) {
      setError('Le mot de passe doit avoir au moins 6 caractères.'); return;
    }
    if (form.motdepasse !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.'); return;
    }
    setError('');
    try {
      await axios.post('https://MouhaemedDiouf221.pythonanywhere.com/api/demandes/soumettre/', {
        nom: form.nom, ville: form.ville, adresse: form.adresse,
        telephone: form.telephone, email: form.email,
        totalLits: form.totalLits, services: form.services,
        responsable: form.responsable,
        motdepasse: form.motdepasse,
      });
      setSuccess('✅ Demande envoyée ! Un administrateur validera votre inscription sous 24h.');
      setTimeout(() => navigate('/login-hopital'), 3000);
    } catch (err) {
      setError('Erreur lors de l\'envoi. Réessayez.');
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '2px solid #e0e8f0', fontSize: '15px', marginTop: '6px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI'
  };
  const labelStyle = { color: '#555', fontSize: '14px', fontWeight: '600' };

  return (
    <div style={{
      minHeight: '100vh', backgroundImage: 'url(/hospi-info.jpg)',
      backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif', position: 'relative', padding: '20px'
    }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(0,40,100,0.80) 0%, rgba(0,100,160,0.70) 100%)',
        zIndex: 0
      }}></div>

      <div style={{
        position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.95)',
        borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '520px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem' }}>🏥</div>
          <h1 style={{ color: '#1a3a6b', fontSize: '1.6rem', marginBottom: '6px' }}>
            Rejoindre HOSPI-INFO
          </h1>
          <p style={{ color: '#888', fontSize: '14px' }}>
            {step === 1 && 'Informations de l\'hôpital'}
            {step === 2 && 'Capacité et services'}
            {step === 3 && 'Compte administrateur'}
          </p>
        </div>

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

        {step === 1 && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Nom de l'hôpital</label>
              <input name="nom" value={form.nom} onChange={handleChange}
                placeholder="Ex: Hôpital Principal de Dakar" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Ville</label>
              <input name="ville" value={form.ville} onChange={handleChange}
                placeholder="Ex: Dakar" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Adresse complète</label>
              <input name="adresse" value={form.adresse} onChange={handleChange}
                placeholder="Ex: Avenue Pasteur, Dakar" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Téléphone</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <div style={{ padding: '12px', background: '#f0f7ff', borderRadius: '10px',
                  border: '2px solid #e0e8f0', color: '#1d72b8', fontWeight: '600' }}>
                  🇸🇳 +221
                </div>
                <input name="telephone" value={form.telephone} onChange={handleChange}
                  placeholder="77 000 00 00" type="tel"
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '10px',
                    border: '2px solid #e0e8f0', fontSize: '15px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Email</label>
              <input name="email" value={form.email} onChange={handleChange}
                placeholder="hopital@email.com" type="email" style={inputStyle} />
            </div>
            <button onClick={etape1}
              style={{ width: '100%', padding: '14px', background: '#1d72b8',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              Suivant →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Nombre total de lits</label>
              <input name="totalLits" value={form.totalLits} onChange={handleChange}
                placeholder="Ex: 200" type="number" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Services disponibles</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {servicesDisponibles.map(service => (
                  <div key={service} onClick={() => toggleService(service)} style={{
                    padding: '8px 16px', borderRadius: '50px', cursor: 'pointer',
                    fontSize: '13px', fontWeight: '500',
                    background: form.services.includes(service) ? '#1d72b8' : '#f0f7ff',
                    color: form.services.includes(service) ? 'white' : '#1d72b8',
                    border: `2px solid ${form.services.includes(service) ? '#1d72b8' : '#e0e8f0'}`
                  }}>
                    {form.services.includes(service) ? '✅ ' : ''}{service}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)}
                style={{ flex: 1, padding: '14px', background: '#f0f7ff',
                  color: '#1d72b8', border: '2px solid #e0e8f0', borderRadius: '10px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                ← Retour
              </button>
              <button onClick={etape2}
                style={{ flex: 2, padding: '14px', background: '#1d72b8',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                Suivant →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Nom du responsable</label>
              <input name="responsable" value={form.responsable} onChange={handleChange}
                placeholder="Votre nom complet" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Mot de passe</label>
              <input name="motdepasse" value={form.motdepasse} onChange={handleChange}
                placeholder="••••••••" type="password" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Confirmer le mot de passe</label>
              <input name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="••••••••" type="password" style={inputStyle} />
            </div>
            <div style={{ background: '#f0f7ff', borderRadius: '12px', padding: '16px',
              marginBottom: '24px', fontSize: '13px', color: '#555' }}>
              <div style={{ fontWeight: '700', color: '#1a3a6b', marginBottom: '8px' }}>
                📋 Récapitulatif
              </div>
              <div>🏥 {form.nom} — {form.ville}</div>
              <div>🛏️ {form.totalLits} lits</div>
              <div>⚕️ {form.services.join(', ')}</div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)}
                style={{ flex: 1, padding: '14px', background: '#f0f7ff',
                  color: '#1d72b8', border: '2px solid #e0e8f0', borderRadius: '10px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                ← Retour
              </button>
              <button onClick={soumettre}
                style={{ flex: 2, padding: '14px', background: '#2ecc71',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                ✅ Soumettre la demande
              </button>
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '14px' }}>
          Déjà inscrit ?{' '}
          <span onClick={() => navigate('/login')}
            style={{ color: '#1d72b8', cursor: 'pointer', fontWeight: '600' }}>
            Se connecter
          </span>
        </div>
      </div>
    </div>
  );
}

export default InscriptionHopital;