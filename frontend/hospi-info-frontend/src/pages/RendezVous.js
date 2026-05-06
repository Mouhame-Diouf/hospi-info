import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:8000';

function RendezVous() {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nom: '', telephone: '', service: '',
    date: '', motif: '',
  });
  const [confirme, setConfirme] = useState(false);
  const [numeroRDV, setNumeroRDV] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hospitalId) {
      axios.get(`${API}/api/hospitals/${hospitalId}/`)
        .then(res => setHospital(res.data))
        .catch(err => console.error(err));
    }
  }, [hospitalId]);

  const getDateMin = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  const confirmerRDV = async () => {
    if (!form.date) {
      alert('Veuillez choisir une date.');
      return;
    }

    const dateChoisie = new Date(form.date);
    if (isNaN(dateChoisie.getTime())) {
      alert('Date invalide.');
      return;
    }

    setLoading(true);
    try {
     const res = await axios.post(`${API}/api/rendezvous/`, {
        hospital_id: hospitalId,
        nom_patient: form.nom,
        telephone: form.telephone,
        motif: form.motif || 'Non spécifié',
        date: form.date,
        heure: '08:00:00',
      });
      setNumeroRDV(res.data.numero_rdv);
      setConfirme(true);
    } catch (err) {
      console.error(err.response?.data);
      alert('Erreur lors de la création du rendez-vous. Vérifiez les informations.');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: '12px',
    border: '2px solid #e2e8f0', fontSize: '15px', marginTop: '6px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'Segoe UI',
    background: '#f8fafc'
  };

  const labelStyle = { color: '#374151', fontSize: '14px', fontWeight: '700' };

  if (confirme) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f4f8',
        fontFamily: 'Segoe UI, sans-serif', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '40px',
          textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          maxWidth: '400px', width: '100%' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
          <h2 style={{ color: '#0f172a', marginBottom: '8px', fontSize: '1.5rem' }}>
            Demande envoyée !
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
            Votre demande a été transmise à l'hôpital.
            Un médecin vous contactera pour confirmer l'heure exacte.
          </p>
          <div style={{ background: '#f0fdf4', borderRadius: '16px',
            padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: '700',
              marginBottom: '12px', letterSpacing: '1px' }}>
              VOTRE DEMANDE
            </div>
            <div style={{ fontSize: '14px', color: '#374151', lineHeight: '2' }}>
              <div>📋 N° : <strong style={{ color: '#2563eb' }}>{numeroRDV}</strong></div>
              <div>👤 Patient : {form.nom}</div>
              <div>🏥 Hôpital : {hospital?.name}</div>
              {form.service && <div>⚕️ Service : {form.service}</div>}
              <div>📅 Date souhaitée : {new Date(form.date).toLocaleDateString('fr-FR', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}</div>
              <div>📱 Statut : <span style={{ color: '#d97706', fontWeight: '700' }}>
                ⏳ En attente de confirmation
              </span></div>
            </div>
          </div>

          <div style={{ background: '#fef3c7', borderRadius: '12px',
            padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ color: '#92400e', fontSize: '13px', fontWeight: '600' }}>
              💡 Que se passe-t-il ensuite ?
            </div>
            <div style={{ color: '#92400e', fontSize: '13px', marginTop: '8px',
              lineHeight: '1.8' }}>
              1. L'hôpital reçoit votre demande<br/>
              2. Un médecin est assigné à votre dossier<br/>
              3. Vous recevez un appel au +221 {form.telephone}<br/>
              4. Votre rendez-vous est confirmé !
            </div>
          </div>

          <button onClick={() => navigate(`/mes-rendezvous?tel=${form.telephone}`)}
            style={{ width: '100%', padding: '14px', background: '#2563eb',
              color: 'white', border: 'none', borderRadius: '12px',
              cursor: 'pointer', fontWeight: '700', fontSize: '15px',
              marginBottom: '12px' }}>
            📋 Voir mes rendez-vous
          </button>

          <button onClick={() => navigate('/home')}
            style={{ width: '100%', padding: '14px', background: '#0f172a',
              color: 'white', border: 'none', borderRadius: '12px',
              cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8',
      fontFamily: 'Segoe UI, sans-serif' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer' }}>
          ⬅
        </button>
        <div>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem' }}>
            📅 Demande de rendez-vous
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>
            {hospital?.name || 'Chargement...'}
          </div>
        </div>
      </div>

      {/* ETAPES */}
      <div style={{ background: 'white', padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: '8px',
        borderBottom: '1px solid #e2e8f0' }}>
        {[
          { n: 1, label: 'Infos' },
          { n: 2, label: 'Service' },
          { n: 3, label: 'Date' }
        ].map((s, i, arr) => (
          <React.Fragment key={s.n}>
            <div style={{ display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '4px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: step >= s.n ? '#2563eb' : '#e2e8f0',
                color: step >= s.n ? 'white' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', fontSize: '14px'
              }}>{s.n}</div>
              <span style={{ fontSize: '10px', fontWeight: '700',
                color: step >= s.n ? '#2563eb' : '#94a3b8' }}>{s.label}</span>
            </div>
            {i < arr.length - 1 && (
              <div style={{ flex: 1, height: '2px', marginBottom: '16px',
                background: step > s.n ? '#2563eb' : '#e2e8f0' }}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div style={{ padding: '20px' }}>

        {/* ETAPE 1 */}
        {step === 1 && (
          <div>
            <h2 style={{ color: '#0f172a', marginBottom: '8px', fontSize: '1.2rem' }}>
              👤 Vos informations
            </h2>
            <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>
              L'hôpital vous contactera pour confirmer votre rendez-vous.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Nom complet *</label>
              <input style={inputStyle} placeholder="Ex: Moussa Diallo"
                value={form.nom}
                onChange={e => setForm({...form, nom: e.target.value})} />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Numéro de téléphone *</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <div style={{ padding: '14px', background: '#f0f7ff',
                  borderRadius: '12px', border: '2px solid #e2e8f0',
                  color: '#2563eb', fontWeight: '700' }}>
                  🇸🇳 +221
                </div>
                <input style={{ ...inputStyle, marginTop: 0, flex: 1 }}
                  placeholder="77 000 00 00" type="tel"
                  value={form.telephone}
                  onChange={e => setForm({...form, telephone: e.target.value})} />
              </div>
            </div>

            <button onClick={() => {
              if (!form.nom || !form.telephone) {
                alert('Veuillez remplir votre nom et téléphone.');
                return;
              }
              setStep(2);
            }}
              style={{ width: '100%', padding: '16px', background: '#0f172a',
                color: 'white', border: 'none', borderRadius: '12px',
                cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}>
              Suivant →
            </button>
          </div>
        )}

        {/* ETAPE 2 */}
        {step === 2 && (
          <div>
            <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.2rem' }}>
              ⚕️ Service et motif
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Service médical souhaité</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.service}
                onChange={e => setForm({...form, service: e.target.value})}>
                <option value="">Sélectionnez un service</option>
                {hospital?.services?.filter(s => s.available).map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Motif de consultation *</label>
              <textarea style={{ ...inputStyle, height: '120px', resize: 'none' }}
                placeholder="Décrivez votre problème de santé..."
                value={form.motif}
                onChange={e => setForm({...form, motif: e.target.value})} />
            </div>

            <div style={{ background: '#eff6ff', borderRadius: '12px',
              padding: '14px', marginBottom: '20px' }}>
              <div style={{ color: '#1d4ed8', fontSize: '13px', fontWeight: '600' }}>
                ℹ️ Le médecin sera assigné par l'hôpital selon votre motif.
              </div>
            </div>

            <button onClick={() => {
              if (!form.motif) {
                alert('Veuillez décrire votre motif de consultation.');
                return;
              }
              setStep(3);
            }}
              style={{ width: '100%', padding: '16px', background: '#0f172a',
                color: 'white', border: 'none', borderRadius: '12px',
                cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}>
              Suivant →
            </button>
          </div>
        )}

        {/* ETAPE 3 */}
        {step === 3 && (
          <div>
            <h2 style={{ color: '#0f172a', marginBottom: '8px', fontSize: '1.2rem' }}>
              📅 Date souhaitée
            </h2>
            <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>
              L'hôpital confirmera ou proposera une autre date.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Date souhaitée *</label>
              <input type="date" style={inputStyle}
                min={getDateMin()}
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})} />
            </div>

            {form.date && (
              <div style={{ background: '#f0fdf4', borderRadius: '16px',
                padding: '16px', marginBottom: '20px',
                border: '1px solid #bbf7d0' }}>
                <div style={{ fontWeight: '800', color: '#0f172a',
                  marginBottom: '12px' }}>📋 Récapitulatif</div>
                <div style={{ fontSize: '14px', color: '#374151', lineHeight: '2' }}>
                  <div>👤 {form.nom}</div>
                  <div>📞 +221 {form.telephone}</div>
                  <div>🏥 {hospital?.name}</div>
                  {form.service && <div>⚕️ {form.service}</div>}
                  <div>📅 {new Date(form.date).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}</div>
                  <div style={{ color: '#6b7280' }}>
                    📝 {form.motif.substring(0, 60)}{form.motif.length > 60 ? '...' : ''}
                  </div>
                </div>
              </div>
            )}

            <div style={{ background: '#fef3c7', borderRadius: '12px',
              padding: '14px', marginBottom: '20px' }}>
              <div style={{ color: '#92400e', fontSize: '13px', fontWeight: '600' }}>
                ⚠️ La date finale sera confirmée par l'hôpital qui vous appellera
                au +221 {form.telephone}
              </div>
            </div>

            <button onClick={confirmerRDV} disabled={loading}
              style={{ width: '100%', padding: '16px',
                background: loading ? '#94a3b8' :
                  'linear-gradient(135deg, #16a34a, #22c55e)',
                color: 'white', border: 'none', borderRadius: '12px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '700', fontSize: '16px' }}>
              {loading ? '⏳ Envoi en cours...' : '📤 Envoyer la demande'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default RendezVous;