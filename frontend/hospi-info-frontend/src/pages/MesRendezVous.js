import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const API = 'https://MouhaemedDiouf221.pythonanywhere.com';

function MesRendezVous() {
  const [telephone, setTelephone] = useState('');
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cherche, setCherche] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tel = params.get('tel');
    if (tel) {
      setTelephone(tel);
      chercher(tel);
    }
  }, [location.search]);

  const chercher = async (tel) => {
    if (!tel) return;
    setLoading(true);
    setCherche(true);
    try {
      const res = await axios.get(`${API}/api/rendezvous/rechercher/?telephone=${tel}`);
      setRdvs(res.data);
    } catch (err) {
      console.error(err);
      setRdvs([]);
    }
    setLoading(false);
  };

  const statutColor = (statut) => {
    switch(statut) {
      case 'confirme': return { bg: '#dcfce7', color: '#16a34a', label: '✅ Confirmé' };
      case 'annule': return { bg: '#fee2e2', color: '#dc2626', label: '❌ Annulé' };
      case 'termine': return { bg: '#f3f4f6', color: '#6b7280', label: '🏁 Terminé' };
      default: return { bg: '#fef3c7', color: '#d97706', label: '⏳ En attente' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8',
      fontFamily: 'Segoe UI, sans-serif' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button onClick={() => navigate('/home')}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer' }}>
          ⬅
        </button>
        <div>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem' }}>
            📋 Mes rendez-vous
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>
            Suivez l'état de vos demandes
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>

        {/* RECHERCHE PAR TÉLÉPHONE */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '20px',
          marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ color: '#0f172a', marginBottom: '16px', fontSize: '1rem' }}>
            🔍 Rechercher vos rendez-vous
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ padding: '12px', background: '#f0f7ff',
              borderRadius: '10px', border: '2px solid #e2e8f0',
              color: '#2563eb', fontWeight: '700', fontSize: '14px' }}>
              🇸🇳 +221
            </div>
            <input
              type="tel"
              placeholder="Votre numéro de téléphone"
              value={telephone}
              onChange={e => setTelephone(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && chercher(telephone)}
              style={{ flex: 1, padding: '12px 16px', borderRadius: '10px',
                border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
            />
            <button onClick={() => chercher(telephone)}
              style={{ padding: '12px 20px', background: '#0f172a',
                color: 'white', border: 'none', borderRadius: '10px',
                cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
              Chercher
            </button>
          </div>
        </div>

        {/* RÉSULTATS */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            ⏳ Chargement...
          </div>
        )}

        {cherche && !loading && rdvs.length === 0 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px',
            textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
            <div style={{ color: '#0f172a', fontWeight: '700', marginBottom: '8px' }}>
              Aucun rendez-vous trouvé
            </div>
            <div style={{ color: '#6b7280', fontSize: '13px' }}>
              Vérifiez votre numéro de téléphone
            </div>
          </div>
        )}

        {rdvs.map(rdv => {
          const statut = statutColor(rdv.statut);
          return (
            <div key={rdv.id} style={{ background: 'white', borderRadius: '20px',
              padding: '20px', marginBottom: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${statut.color}` }}>

              {/* En-tête */}
              <div style={{ display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>
                    {rdv.hospital}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>
                    N° {rdv.numero_rdv}
                  </div>
                </div>
                <span style={{ padding: '6px 14px', borderRadius: '50px',
                  fontSize: '12px', fontWeight: '700',
                  background: statut.bg, color: statut.color }}>
                  {statut.label}
                </span>
              </div>

              {/* Détails */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700',
                    marginBottom: '4px' }}>DATE SOUHAITÉE</div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                    📅 {new Date(rdv.date).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700',
                    marginBottom: '4px' }}>SERVICE</div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                    ⚕️ {rdv.service || 'Non spécifié'}
                  </div>
                </div>
              </div>

              {rdv.medecin && (
                <div style={{ background: '#eff6ff', borderRadius: '10px',
                  padding: '12px', marginBottom: '12px',
                  display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '1.5rem' }}>👨‍⚕️</div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '700' }}>
                      MÉDECIN ASSIGNÉ
                    </div>
                    <div style={{ fontWeight: '700', color: '#1e40af' }}>{rdv.medecin}</div>
                  </div>
                </div>
              )}

              {/* Message selon statut */}
              {rdv.statut === 'en_attente' && (
                <div style={{ background: '#fef3c7', borderRadius: '10px',
                  padding: '12px', fontSize: '13px', color: '#92400e' }}>
                  ⏳ En attente — L'hôpital va vous contacter pour confirmer l'heure exacte.
                </div>
              )}
              {rdv.statut === 'confirme' && (
                <div style={{ background: '#dcfce7', borderRadius: '10px',
                  padding: '12px', fontSize: '13px', color: '#15803d' }}>
                  ✅ Confirmé — Présentez-vous à l'hôpital à l'heure convenue.
                </div>
              )}
              {rdv.statut === 'annule' && (
                <div style={{ background: '#fee2e2', borderRadius: '10px',
                  padding: '12px', fontSize: '13px', color: '#b91c1c' }}>
                  ❌ Annulé — Contactez l'hôpital pour plus d'informations.
                </div>
              )}
            </div>
          );
        })}

        {/* NOUVEAU RDV */}
        {cherche && (
          <button onClick={() => navigate('/home')}
            style={{ width: '100%', padding: '16px', background: '#2563eb',
              color: 'white', border: 'none', borderRadius: '16px',
              cursor: 'pointer', fontWeight: '700', fontSize: '16px',
              marginTop: '8px' }}>
            📅 Prendre un nouveau rendez-vous
          </button>
        )}
      </div>
    </div>
  );
}

export default MesRendezVous;