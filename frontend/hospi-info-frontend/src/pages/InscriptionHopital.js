import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://MouhaemedDiouf221.pythonanywhere.com';

function InscriptionHopital() {
  const [form, setForm] = useState({
    nom: '', ville: '', adresse: '', telephone: '',
    email: '', totalLits: '', services: [],
    responsable: '', motdepasse: '', confirm: '',
    latitude: null, longitude: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsOk, setGpsOk] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const detecterPosition = () => {
    setGpsLoading(true);
    setError('');
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée.');
      setGpsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        setGpsOk(true);
        setGpsLoading(false);
      },
      () => {
        setError('Impossible de détecter la position GPS.');
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const soumettre = async () => {
    if (!form.nom || !form.ville || !form.adresse || !form.telephone || !form.email) {
      setError('Veuillez remplir les informations de l\'hôpital.'); return;
    }
    if (!form.totalLits || form.services.length === 0) {
      setError('Veuillez entrer le nombre de lits et sélectionner au moins un service.'); return;
    }
    if (!form.responsable || !form.motdepasse || !form.confirm) {
      setError('Veuillez remplir les informations du responsable.'); return;
    }
    if (form.motdepasse.length < 6) {
      setError('Le mot de passe doit avoir au moins 6 caractères.'); return;
    }
    if (form.motdepasse !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.'); return;
    }
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API}/api/demandes/soumettre/`, {
        nom: form.nom,
        ville: form.ville,
        adresse: form.adresse,
        telephone: form.telephone,
        email: form.email,
        totalLits: form.totalLits,
        services: form.services,
        responsable: form.responsable,
        motdepasse: form.motdepasse,
        latitude: form.latitude,
        longitude: form.longitude,
      });
      setSuccess('✅ Demande envoyée ! Un administrateur validera votre inscription sous 24h.');
      setTimeout(() => navigate('/connexion'), 3000);
    } catch {
      setError('Erreur lors de l\'envoi. Réessayez.');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '2px solid #e0e8f0', fontSize: '14px', marginTop: '5px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI',
    background: '#f8fafc'
  };
  const labelStyle = {
    color: '#374151', fontSize: '13px', fontWeight: '700'
  };
  const sectionStyle = {
    background: '#f8fafc', borderRadius: '14px',
    padding: '16px', marginBottom: '16px',
    border: '1px solid #e2e8f0'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        padding: '28px', width: '100%', maxWidth: '560px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        marginTop: '10px', marginBottom: '20px'
      }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2.5rem' }}>🏥</div>
          <h1 style={{ color: '#1a3a6b', fontSize: '1.4rem',
            margin: '8px 0 4px', fontWeight: '800' }}>
            Rejoindre HOSPI-INFO
          </h1>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
            Remplissez le formulaire — votre demande sera validée sous 24h
          </p>
        </div>

        {/* MESSAGES */}
        {error && (
          <div style={{ background: '#fee2e2', color: '#dc2626',
            padding: '12px', borderRadius: '10px',
            marginBottom: '16px', fontSize: '13px',
            textAlign: 'center', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#dcfce7', color: '#16a34a',
            padding: '12px', borderRadius: '10px',
            marginBottom: '16px', fontSize: '13px',
            textAlign: 'center', fontWeight: '600' }}>
            {success}
          </div>
        )}

        {/* ── SECTION 1 : INFOS HÔPITAL ── */}
        <div style={sectionStyle}>
          <div style={{ fontSize: '13px', fontWeight: '800',
            color: '#1d72b8', marginBottom: '12px' }}>
            🏥 Informations de l'hôpital
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Nom de l'hôpital *</label>
            <input name="nom" value={form.nom} onChange={handleChange}
              placeholder="Ex: Hôpital Principal de Dakar" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <label style={labelStyle}>Ville *</label>
              <input name="ville" value={form.ville} onChange={handleChange}
                placeholder="Ex: Dakar" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Téléphone *</label>
              <input name="telephone" value={form.telephone} onChange={handleChange}
                placeholder="77 000 00 00" type="tel" style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Adresse complète *</label>
            <input name="adresse" value={form.adresse} onChange={handleChange}
              placeholder="Ex: Avenue Pasteur, Dakar" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Email *</label>
            <input name="email" value={form.email} onChange={handleChange}
              placeholder="hopital@email.com" type="email" style={inputStyle} />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Nombre total de lits *</label>
            <input name="totalLits" value={form.totalLits} onChange={handleChange}
              placeholder="Ex: 200" type="number" style={inputStyle} />
          </div>

          {/* GPS */}
          <div>
            <label style={labelStyle}>Position GPS sur la carte</label>
            <button onClick={detecterPosition} disabled={gpsLoading}
              style={{ width: '100%', padding: '11px', marginTop: '6px',
                background: gpsOk ? '#dcfce7' : '#eff6ff',
                color: gpsOk ? '#16a34a' : '#2563eb',
                border: `2px solid ${gpsOk ? '#16a34a' : '#2563eb'}`,
                borderRadius: '10px', cursor: 'pointer',
                fontWeight: '700', fontSize: '13px' }}>
              {gpsLoading ? '⏳ Détection...' :
                gpsOk ? `✅ GPS détecté (${form.latitude?.toFixed(4)}, ${form.longitude?.toFixed(4)})` :
                '📍 Détecter ma position GPS automatiquement'}
            </button>
          </div>
        </div>

        {/* ── SECTION 2 : SERVICES ── */}
        <div style={sectionStyle}>
          <div style={{ fontSize: '13px', fontWeight: '800',
            color: '#1d72b8', marginBottom: '12px' }}>
            ⚕️ Services disponibles *
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {servicesDisponibles.map(service => (
              <div key={service} onClick={() => toggleService(service)} style={{
                padding: '7px 14px', borderRadius: '50px',
                cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                background: form.services.includes(service) ? '#1d72b8' : '#f0f7ff',
                color: form.services.includes(service) ? 'white' : '#1d72b8',
                border: `2px solid ${form.services.includes(service) ? '#1d72b8' : '#e0e8f0'}`,
                transition: 'all 0.2s'
              }}>
                {form.services.includes(service) ? '✅ ' : ''}{service}
              </div>
            ))}
          </div>
          {form.services.length > 0 && (
            <div style={{ fontSize: '12px', color: '#16a34a',
              marginTop: '8px', fontWeight: '600' }}>
              {form.services.length} service(s) sélectionné(s)
            </div>
          )}
        </div>

        {/* ── SECTION 3 : COMPTE ── */}
        <div style={sectionStyle}>
          <div style={{ fontSize: '13px', fontWeight: '800',
            color: '#1d72b8', marginBottom: '12px' }}>
            🔐 Compte administrateur
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>Nom du responsable *</label>
            <input name="responsable" value={form.responsable} onChange={handleChange}
              placeholder="Votre nom complet" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Mot de passe *</label>
              <input name="motdepasse" value={form.motdepasse} onChange={handleChange}
                placeholder="Min. 6 caractères" type="password" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Confirmer *</label>
              <input name="confirm" value={form.confirm} onChange={handleChange}
                placeholder="Répétez le mot de passe" type="password" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* BOUTON SOUMETTRE */}
        <button onClick={soumettre} disabled={loading}
          style={{ width: '100%', padding: '16px',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #16a34a, #15803d)',
            color: 'white', border: 'none', borderRadius: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '800', fontSize: '16px',
            boxShadow: '0 4px 14px rgba(22,163,74,0.4)' }}>
          {loading ? '⏳ Envoi en cours...' : '✅ Soumettre ma demande d\'inscription'}
        </button>

        {/* LIEN CONNEXION */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span style={{ color: '#6b7280', fontSize: '13px' }}>
            Déjà inscrit ?{' '}
          </span>
          <span onClick={() => navigate('/connexion')}
            style={{ color: '#2563eb', fontWeight: '700',
              cursor: 'pointer', fontSize: '13px' }}>
            Se connecter ici
          </span>
        </div>

      </div>
    </div>
  );
}

export default InscriptionHopital;