import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://MouhaemedDiouf221.pythonanywhere.com';

function DashboardHopital() {
  const [hopital, setHopital] = useState(null);
  const [rdvs, setRdvs] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [message, setMessage] = useState('');
  const [litsDisponibles, setLitsDisponibles] = useState('');
  const [activeTab, setActiveTab] = useState('rdv');
  const [nouveauMedecin, setNouveauMedecin] = useState({
    nom: '', specialite: '', telephone: '',
    heure_debut: '08:00', heure_fin: '17:00', jours_travail: 'Lun-Ven'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const hopitalData = localStorage.getItem('hopital_connecte');
    if (!hopitalData) { navigate('/login-hopital'); return; }
    const h = JSON.parse(hopitalData);

    axios.get(`${API}/api/hospitals/${h.id}/`)
      .then(res => {
        setHopital(res.data);
        setLitsDisponibles(res.data.available_beds);
      });

    axios.get(`${API}/api/hospitals/${h.id}/rendezvous/`)
      .then(res => setRdvs(res.data));

    axios.get(`${API}/api/hospitals/${h.id}/medecins/`)
      .then(res => setMedecins(res.data));

    const interval = setInterval(() => {
      axios.get(`${API}/api/hospitals/${h.id}/rendezvous/`)
        .then(res => setRdvs(res.data));
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  const mettreAJourLits = async () => {
    try {
      await axios.patch(`${API}/api/hospitals/${hopital.id}/beds/`,
        { available_beds: parseInt(litsDisponibles) }
      );
      setMessage('✅ Lits mis à jour !');
      const res = await axios.get(`${API}/api/hospitals/${hopital.id}/`);
      setHopital(res.data);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Erreur mise à jour lits.');
    }
  };

  const traiterRDV = async (id, statut) => {
    try {
      await axios.patch(`${API}/api/rendezvous/${id}/`, { statut });
      setRdvs(rdvs.map(r => r.id === id ? { ...r, statut } : r));
      setMessage(statut === 'confirme' ? '✅ Rendez-vous confirmé !' : '❌ Rendez-vous annulé.');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Erreur.');
    }
  };

  const ajouterMedecin = async () => {
    if (!nouveauMedecin.nom || !nouveauMedecin.specialite) {
      alert('Veuillez remplir le nom et la spécialité.');
      return;
    }
    try {
      await axios.post(`${API}/api/hospitals/${hopital.id}/medecins/create/`, nouveauMedecin);
      const res = await axios.get(`${API}/api/hospitals/${hopital.id}/medecins/`);
      setMedecins(res.data);
      setNouveauMedecin({ nom: '', specialite: '', telephone: '',
        heure_debut: '08:00', heure_fin: '17:00', jours_travail: 'Lun-Ven' });
      setMessage('✅ Médecin ajouté !');
      setTimeout(() => setMessage(''), 3000);
    } catch(err) {
      console.error(err.response?.data);
      setMessage('❌ Erreur ajout médecin.');
    }
  };

  const toggleDisponibilite = async (medecin) => {
    try {
      await axios.patch(`${API}/api/medecins/${medecin.id}/`,
        { disponible: !medecin.disponible });
      setMedecins(medecins.map(m => m.id === medecin.id ?
        { ...m, disponible: !m.disponible } : m));
    } catch {
      setMessage('❌ Erreur.');
    }
  };

  const supprimerMedecin = async (id) => {
    if (!window.confirm('Supprimer ce médecin ?')) return;
    try {
      await axios.delete(`${API}/api/medecins/${id}/delete/`);
      setMedecins(medecins.filter(m => m.id !== id));
      setMessage('✅ Médecin supprimé !');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Erreur suppression.');
    }
  };

  const deconnecter = () => {
    localStorage.removeItem('hopital_connecte');
    navigate('/login-hopital');
  };

  const rdvEnAttente = rdvs.filter(r => r.statut === 'en_attente').length;

  if (!hopital) return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Segoe UI' }}>
      ⏳ Chargement...
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8',
      fontFamily: 'Segoe UI, sans-serif', paddingBottom: '20px' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
        padding: '16px 20px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '1.1rem' }}>
            🏥 {hopital.name}
          </div>
          <div style={{ color: '#4ade80', fontSize: '11px', fontWeight: '600' }}>
            ● Dashboard en temps réel
          </div>
        </div>
        <button onClick={deconnecter}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', padding: '8px 16px', borderRadius: '50px',
            cursor: 'pointer', fontSize: '13px' }}>
          Déconnexion
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <div style={{ margin: '16px', padding: '14px', borderRadius: '12px',
          background: message.includes('✅') ? '#dcfce7' : '#fee2e2',
          color: message.includes('✅') ? '#16a34a' : '#dc2626',
          fontWeight: '700', textAlign: 'center' }}>
          {message}
        </div>
      )}

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px', margin: '16px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px',
          textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderTop: '3px solid #2563eb' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2563eb' }}>
            {hopital.available_beds}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>Lits libres</div>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px',
          textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderTop: '3px solid #d97706' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#d97706' }}>
            {rdvEnAttente}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>RDV en attente</div>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px',
          textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          borderTop: '3px solid #16a34a' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#16a34a' }}>
            {medecins.filter(m => m.disponible).length}
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>Médecins dispo</div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', margin: '0 16px 16px', background: 'white',
        borderRadius: '16px', padding: '6px', gap: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {[
          { id: 'rdv', label: `📅 RDV (${rdvs.length})` },
          { id: 'medecins', label: `👨‍⚕️ Médecins (${medecins.length})` },
          { id: 'lits', label: '🛏️ Lits' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '12px',
              cursor: 'pointer', fontWeight: '700', fontSize: '12px',
              background: activeTab === tab.id ? '#0f172a' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#6b7280' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* ONGLET RDV */}
        {activeTab === 'rdv' && (
          <div>
            <h3 style={{ color: '#0f172a', marginBottom: '16px' }}>
              📅 Demandes de rendez-vous
            </h3>
            {rdvs.length === 0 && (
              <div style={{ background: 'white', borderRadius: '16px',
                padding: '40px', textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>📭</div>
                <div style={{ color: '#6b7280' }}>Aucune demande de rendez-vous</div>
              </div>
            )}
            {rdvs.map(r => (
              <div key={r.id} style={{ background: 'white', borderRadius: '16px',
                padding: '16px', marginBottom: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${r.statut === 'confirme' ? '#16a34a' :
                  r.statut === 'annule' ? '#dc2626' : '#d97706'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>
                      {r.nom_patient}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>
                      📞 {r.telephone} · N° {r.numero_rdv}
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700',
                    padding: '4px 10px', borderRadius: '50px',
                    background: r.statut === 'confirme' ? '#dcfce7' :
                      r.statut === 'annule' ? '#fee2e2' : '#fef3c7',
                    color: r.statut === 'confirme' ? '#16a34a' :
                      r.statut === 'annule' ? '#dc2626' : '#d97706' }}>
                    {r.statut === 'confirme' ? '✅ Confirmé' :
                      r.statut === 'annule' ? '❌ Annulé' : '⏳ En attente'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#374151',
                  marginBottom: '12px', lineHeight: '1.8' }}>
                  {r.service && <div>⚕️ {r.service}</div>}
                  <div>📅 {new Date(r.date).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}</div>
                  {r.motif && <div style={{ color: '#6b7280' }}>
                    📝 {r.motif.substring(0, 80)}
                  </div>}
                </div>
                {r.statut === 'en_attente' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => traiterRDV(r.id, 'confirme')}
                      style={{ flex: 1, padding: '10px', background: '#16a34a',
                        color: 'white', border: 'none', borderRadius: '10px',
                        cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                      ✅ Confirmer
                    </button>
                    <button onClick={() => traiterRDV(r.id, 'annule')}
                      style={{ flex: 1, padding: '10px', background: '#dc2626',
                        color: 'white', border: 'none', borderRadius: '10px',
                        cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                      ❌ Annuler
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ONGLET MÉDECINS */}
        {activeTab === 'medecins' && (
          <div>
            <h3 style={{ color: '#0f172a', marginBottom: '16px' }}>
              👨‍⚕️ Gestion des médecins
            </h3>

            {/* AJOUTER MÉDECIN */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '16px',
              marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h4 style={{ color: '#0f172a', marginBottom: '12px' }}>
                ➕ Ajouter un médecin
              </h4>
              {['nom', 'specialite', 'telephone'].map(field => (
                <input key={field}
                  placeholder={field === 'nom' ? 'Nom du médecin *' :
                    field === 'specialite' ? 'Spécialité *' : 'Téléphone'}
                  value={nouveauMedecin[field]}
                  onChange={e => setNouveauMedecin({...nouveauMedecin, [field]: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px',
                    border: '2px solid #e2e8f0', marginBottom: '8px',
                    boxSizing: 'border-box', fontSize: '14px' }} />
              ))}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#6b7280' }}>Heure début</label>
                  <input type="time" value={nouveauMedecin.heure_debut}
                    onChange={e => setNouveauMedecin({...nouveauMedecin, heure_debut: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px',
                      border: '2px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#6b7280' }}>Heure fin</label>
                  <input type="time" value={nouveauMedecin.heure_fin}
                    onChange={e => setNouveauMedecin({...nouveauMedecin, heure_fin: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px',
                      border: '2px solid #e2e8f0', boxSizing: 'border-box' }} />
                </div>
              </div>
              <input placeholder="Jours de travail (ex: Lun-Ven)"
                value={nouveauMedecin.jours_travail}
                onChange={e => setNouveauMedecin({...nouveauMedecin, jours_travail: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px',
                  border: '2px solid #e2e8f0', marginBottom: '12px',
                  boxSizing: 'border-box', fontSize: '14px' }} />
              <button onClick={ajouterMedecin}
                style={{ width: '100%', padding: '12px', background: '#0f172a',
                  color: 'white', border: 'none', borderRadius: '10px',
                  cursor: 'pointer', fontWeight: '700' }}>
                ➕ Ajouter
              </button>
            </div>

            {/* LISTE MÉDECINS */}
            {medecins.length === 0 && (
              <div style={{ background: 'white', borderRadius: '16px',
                padding: '30px', textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👨‍⚕️</div>
                <div style={{ color: '#6b7280' }}>Aucun médecin enregistré</div>
              </div>
            )}
            {medecins.map(m => (
              <div key={m.id} style={{ background: 'white', borderRadius: '16px',
                padding: '16px', marginBottom: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${m.disponible ? '#16a34a' : '#ef4444'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{m.nom}</div>
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>{m.specialite}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                      🕐 {m.heure_debut} - {m.heure_fin} · 📅 {m.jours_travail}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button onClick={() => toggleDisponibilite(m)}
                      style={{ padding: '6px 10px', border: 'none', borderRadius: '50px',
                        cursor: 'pointer', fontWeight: '700', fontSize: '11px',
                        background: m.disponible ? '#dcfce7' : '#fee2e2',
                        color: m.disponible ? '#16a34a' : '#dc2626' }}>
                      {m.disponible ? '✅ Dispo' : '❌ Indispo'}
                    </button>
                    <button onClick={() => supprimerMedecin(m.id)}
                      style={{ padding: '6px 10px', border: 'none', borderRadius: '50px',
                        cursor: 'pointer', background: '#fee2e2',
                        color: '#dc2626', fontWeight: '700', fontSize: '11px' }}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ONGLET LITS */}
        {activeTab === 'lits' && (
          <div>
            <h3 style={{ color: '#0f172a', marginBottom: '16px' }}>
              🛏️ Gestion des lits
            </h3>
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  marginBottom: '8px' }}>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>
                    Taux d'occupation
                  </span>
                  <span style={{ fontWeight: '700', color: '#2563eb' }}>
                    {hopital.occupancy_rate}%
                  </span>
                </div>
                <div style={{ background: '#f1f5f9', borderRadius: '50px', height: '10px' }}>
                  <div style={{
                    background: hopital.occupancy_rate > 80 ? '#ef4444' : '#22c55e',
                    borderRadius: '50px', height: '10px',
                    width: `${hopital.occupancy_rate}%`
                  }}></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#eff6ff', borderRadius: '12px',
                  padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2563eb' }}>
                    {hopital.available_beds}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Lits disponibles</div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: '12px',
                  padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#374151' }}>
                    {hopital.total_beds}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Lits totaux</div>
                </div>
              </div>

              <label style={{ color: '#374151', fontSize: '14px', fontWeight: '700' }}>
                Mettre à jour les lits disponibles
              </label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <input type="number" value={litsDisponibles}
                  onChange={e => setLitsDisponibles(e.target.value)}
                  min="0" max={hopital.total_beds}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px',
                    border: '2px solid #e2e8f0', fontSize: '16px',
                    textAlign: 'center', fontWeight: '800', outline: 'none' }} />
                <button onClick={mettreAJourLits}
                  style={{ padding: '12px 20px', background: '#0f172a',
                    color: 'white', border: 'none', borderRadius: '10px',
                    cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                  ✅ Mettre à jour
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DashboardHopital;