import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://MouhaemedDiouf221.pythonanywhere.com';

function ServiceDetail() {
  const { hospitalId, serviceName } = useParams();
  const [hospital, setHospital] = useState(null);
  const [service, setService] = useState(null);
  const [medecins, setMedecins] = useState([]);
  const navigate = useNavigate();

  const infosServices = {
    'urgences': { icon: '🚨', description: 'Service d\'urgences médicales 24h/24', horaires: '24h/24 — 7j/7', tempsAttente: '15-30 minutes', equipements: ['Scanner', 'Radiologie', 'Bloc opératoire', 'Réanimation'], conseils: 'Apportez votre carnet de santé et vos ordonnances précédentes.' },
    'maternité': { icon: '🤱', description: 'Service de maternité et gynécologie', horaires: '24h/24 — 7j/7', tempsAttente: '20-45 minutes', equipements: ['Salle d\'accouchement', 'Échographe', 'Monitoring fœtal', 'Néonatologie'], conseils: 'Apportez votre carnet de grossesse et vos dernières échographies.' },
    'pédiatrie': { icon: '👶', description: 'Service de soins pour enfants de 0 à 15 ans', horaires: '8h - 20h (urgences 24h/24)', tempsAttente: '20-40 minutes', equipements: ['Incubateurs', 'Moniteurs pédiatriques', 'Pharmacie pédiatrique'], conseils: 'Apportez le carnet de vaccination et le carnet de santé de l\'enfant.' },
    'chirurgie': { icon: '🔪', description: 'Service de chirurgie générale et spécialisée', horaires: '7h - 19h (urgences 24h/24)', tempsAttente: '30-60 minutes', equipements: ['3 Blocs opératoires', 'Réveil post-opératoire', 'Imagerie médicale'], conseils: 'À jeun depuis minuit pour toute intervention chirurgicale programmée.' },
    'cardiologie': { icon: '❤️', description: 'Service de cardiologie et maladies cardiovasculaires', horaires: '8h - 18h (urgences 24h/24)', tempsAttente: '25-50 minutes', equipements: ['ECG', 'Échographie cardiaque', 'Holter', 'Salle de cathétérisme'], conseils: 'Apportez vos anciens ECG et résultats d\'examens cardiaques.' },
    'neurologie': { icon: '🧠', description: 'Service de neurologie', horaires: '8h - 17h', tempsAttente: '30-60 minutes', equipements: ['IRM', 'Scanner cérébral', 'EEG'], conseils: 'Apportez vos imageries cérébrales précédentes.' },
    'radiologie': { icon: '🩻', description: 'Service d\'imagerie médicale', horaires: '7h30 - 18h', tempsAttente: '15-30 minutes', equipements: ['IRM', 'Scanner', 'Mammographe', 'Échographie'], conseils: 'Retirez bijoux et objets métalliques.' },
    'réanimation': { icon: '💊', description: 'Service de réanimation et soins intensifs', horaires: '24h/24 — 7j/7', tempsAttente: 'Accès immédiat', equipements: ['Respirateurs', 'Monitoring continu', 'Dialyse'], conseils: 'Service réservé aux patients en état critique.' },
    'dermatologie': { icon: '🧴', description: 'Service de dermatologie', horaires: '8h - 16h', tempsAttente: '20-40 minutes', equipements: ['Dermatoscope', 'Laser', 'Cryothérapie'], conseils: 'Évitez de mettre de la crème avant la consultation.' },
    'psychiatrie': { icon: '🧘', description: 'Service de psychiatrie et santé mentale', horaires: '8h - 17h', tempsAttente: '30-60 minutes', equipements: ['Unité d\'hospitalisation', 'Salle de thérapie'], conseils: 'La confidentialité est garantie.' },
  };

  useEffect(() => {
    // Charger hôpital
    axios.get(`${API}/api/hospitals/${hospitalId}/`)
      .then(res => {
        setHospital(res.data);
        const s = res.data.services.find(sv =>
          sv.name.toLowerCase() === decodeURIComponent(serviceName).toLowerCase()
        );
        setService(s);
      })
      .catch(err => console.error(err));

    // Charger les VRAIS médecins depuis l'API
    axios.get(`${API}/api/hospitals/${hospitalId}/medecins/?service=${decodeURIComponent(serviceName)}`)
      .then(res => setMedecins(res.data))
      .catch(err => console.error(err));

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(() => {
      axios.get(`${API}/api/hospitals/${hospitalId}/medecins/?service=${decodeURIComponent(serviceName)}`)
        .then(res => setMedecins(res.data));
    }, 30000);

    return () => clearInterval(interval);
  }, [hospitalId, serviceName]);

  const nomService = decodeURIComponent(serviceName).toLowerCase();
  const infos = infosServices[nomService] || {
    icon: '🏥', description: 'Service médical spécialisé',
    horaires: '8h - 17h', tempsAttente: '20-40 minutes',
    equipements: [], conseils: 'Contactez l\'hôpital pour plus d\'informations.'
  };

  if (!hospital) return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Segoe UI' }}>
      ⏳ Chargement...
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8',
      fontFamily: 'Segoe UI, sans-serif' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate(`/hospital/${hospitalId}`)}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer' }}>
          ⬅
        </button>
        <div style={{ fontSize: '2rem' }}>{infos.icon}</div>
        <div>
          <div style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
            {decodeURIComponent(serviceName)}
          </div>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>{hospital.name}</div>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>

        {/* STATUS SERVICE */}
        <div style={{
          background: service?.available ? '#dcfce7' : '#fee2e2',
          border: `2px solid ${service?.available ? '#16a34a' : '#dc2626'}`,
          borderRadius: '16px', padding: '16px', marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{ fontSize: '2rem' }}>{service?.available ? '✅' : '❌'}</div>
          <div>
            <div style={{ fontWeight: '700',
              color: service?.available ? '#16a34a' : '#dc2626' }}>
              {service?.available ? 'Service disponible' : 'Service indisponible'}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>{infos.description}</div>
          </div>
        </div>

        {/* INFOS RAPIDES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🕐</div>
            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>Horaires</div>
            <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
              {infos.horaires}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>⏳</div>
            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>
              Temps d'attente
            </div>
            <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>
              {infos.tempsAttente}
            </div>
          </div>
        </div>

        {/* VRAIS MÉDECINS */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px',
          marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: '#0f172a', marginBottom: '4px', fontSize: '1rem' }}>
            👨‍⚕️ Médecins du service
          </h3>
          <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '16px' }}>
            🔄 Mis à jour en temps réel
          </p>

          {medecins.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👨‍⚕️</div>
              <div>Aucun médecin enregistré pour ce service</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>
                Contactez l'hôpital directement
              </div>
            </div>
          ) : (
            medecins.map((m, i) => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 0',
                borderBottom: i < medecins.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: m.disponible ? '#dcfce7' : '#fee2e2',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0
                }}>
                  👨‍⚕️
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                    {m.nom}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>{m.specialite}</div>
                  <div style={{ fontSize: '11px', marginTop: '4px' }}>
                    🕐 {m.heure_debut} - {m.heure_fin} · 📅 {m.jours_travail}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px', borderRadius: '50px',
                  fontSize: '11px', fontWeight: '700',
                  background: m.disponible ? '#dcfce7' : '#fef3c7',
                  color: m.disponible ? '#16a34a' : '#d97706'
                }}>
                  {m.disponible ? '✅ Disponible' : '⏰ Indisponible'}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ÉQUIPEMENTS */}
        {infos.equipements.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '16px',
            marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h3 style={{ color: '#0f172a', marginBottom: '12px', fontSize: '1rem' }}>
              🏗️ Équipements disponibles
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {infos.equipements.map((eq, i) => (
                <span key={i} style={{ background: '#eff6ff', color: '#2563eb',
                  padding: '6px 14px', borderRadius: '50px',
                  fontSize: '12px', fontWeight: '600' }}>
                  ✓ {eq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CONSEILS */}
        <div style={{ background: '#fef3c7', borderRadius: '16px', padding: '16px',
          marginBottom: '16px', border: '1px solid #fbbf24' }}>
          <h3 style={{ color: '#92400e', marginBottom: '8px', fontSize: '1rem' }}>
            💡 Conseils pratiques
          </h3>
          <p style={{ color: '#92400e', fontSize: '13px', lineHeight: '1.6' }}>
            {infos.conseils}
          </p>
        </div>

        {/* PRENDRE RDV */}
        <button onClick={() => navigate(`/rendezvous/${hospitalId}`)}
          style={{ width: '100%', padding: '16px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white', border: 'none', borderRadius: '16px',
            cursor: 'pointer', fontWeight: '700', fontSize: '16px',
            marginBottom: '12px' }}>
          📅 Prendre un rendez-vous
        </button>

        {/* CONTACT */}
        <div style={{ background: '#0f172a', borderRadius: '16px',
          padding: '16px', color: 'white' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '1rem' }}>
            📞 Contacter l'hôpital
          </h3>
          <div style={{ marginBottom: '8px', fontSize: '14px' }}>
            🏥 {hospital.name}
          </div>
          <div style={{ marginBottom: '16px', fontSize: '14px', opacity: 0.8 }}>
            📞 {hospital.phone || 'Numéro non disponible'}
          </div>
          {hospital.phone && (
            <button onClick={() => window.open(`tel:${hospital.phone}`)}
              style={{ width: '100%', background: '#2563eb', color: 'white',
                border: 'none', padding: '12px 24px', borderRadius: '50px',
                cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
              📞 Appeler maintenant
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default ServiceDetail;