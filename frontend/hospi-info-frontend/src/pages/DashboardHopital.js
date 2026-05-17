import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://MouhaemedDiouf221.pythonanywhere.com';

function DashboardHopital() {
  const [hopital, setHopital] = useState(null);
  const [rdvs, setRdvs] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');
  const [litsDisponibles, setLitsDisponibles] = useState('');
  const [activeTab, setActiveTab] = useState('rdv');
  const [nouveauMedecin, setNouveauMedecin] = useState({
    nom: '', specialite: '', telephone: '',
    heure_debut: '08:00', heure_fin: '17:00', jours_travail: 'Lun-Ven'
  });
  const [nouveauService, setNouveauService] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const hopitalData = localStorage.getItem('hopital_connecte');
    if (!hopitalData) { navigate('/login-hopital'); return; }
    const h = JSON.parse(hopitalData);

    axios.get(`${API}/api/hospitals/${h.id}/`)
      .then(res => {
        setHopital(res.data);
        setLitsDisponibles(res.data.available_beds);
        setServices(res.data.services || []);
      });

    axios.get(`${API}/api/hospitals/${h.id}/rendezvous/`)
      .then(res => setRdvs(res.data));

    axios.get(`${API}/api/hospitals/${h.id}/medecins/`)
      .then(res => setMedecins(res.data));

    const interval = setInterval(() => {
      axios.get(`${API}/api/hospitals/${h.id}/rendezvous/`)
        .then(res => setRdvs(res.data));
      axios.get(`${API}/api/hospitals/${h.id}/`)
        .then(res => setServices(res.data.services || []));
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

  const traiterRDV = async (id, statut, heure = null) => {
    try {
      const data = { statut };
      if (heure) data.heure = heure;
      await axios.patch(`${API}/api/rendezvous/${id}/`, data);
      setRdvs(rdvs.map(r => r.id === id ? { ...r, statut, heure: heure || r.heure } : r));
      setMessage(statut === 'confirme' ? '✅ RDV confirmé avec heure fixée !' : '❌ RDV annulé.');
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

  const toggleService = async (service) => {
    try {
      await axios.patch(`${API}/api/services/${service.id}/update/`,
        { available: !service.available });
      setServices(services.map(s => s.id === service.id ?
        { ...s, available: !s.available } : s));
      setMessage(`✅ Service ${service.name} mis à jour !`);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Erreur mise à jour service.');
    }
  };

  const ajouterService = async () => {
    if (!nouveauService.trim()) {
      alert('Veuillez entrer un nom de service.');
      return;
    }
    try {
      await axios.post(`${API}/api/hospitals/${hopital.id}/services/`, {
        name: nouveauService, available: true
      });
      const res = await axios.get(`${API}/api/hospitals/${hopital.id}/`);
      setServices(res.data.services || []);
      setNouveauService('');
      setMessage('✅ Service ajouté !');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Erreur ajout service.');
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px', margin: '16px' }}>
        {[
          { label: 'Lits libres', value: hopital.available_beds, color: '#2563eb' },
          { label: 'RDV attente', value: rdvEnAttente, color: '#d97706' },
          { label: 'Médecins', value: medecins.filter(m => m.disponible).length, color: '#16a34a' },
          { label: 'Services', value: services.filter(s => s.available).length, color: '#7c3aed' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '12px',
            padding: '12px', textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: '10px', color: '#6b7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', margin: '0 16px 16px', background: 'white',
        borderRadius: '16px', padding: '6px', gap: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        {[
          { id: 'rdv', label: `📅 RDV (${rdvs.length})` },
          { id: 'medecins', label: `👨‍⚕️ Médecins` },
          { id: 'services', label: `⚕️ Services` },
          { id: 'lits', label: '🛏️ Lits' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '12px',
              cursor: 'pointer', fontWeight: '700', fontSize: '11px',
              whiteSpace: 'nowrap',
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

                {/* EN-TÊTE RDV */}
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '15px' }}>
                      {r.nom_patient}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>
                      N° {r.numero_rdv}
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

                {/* DÉTAILS */}
                <div style={{ fontSize: '13px', color: '#374151',
                  marginBottom: '12px', lineHeight: '1.8',
                  background: '#f8fafc', borderRadius: '10px', padding: '10px' }}>
                  {r.service && <div>⚕️ Service : <strong>{r.service}</strong></div>}
                  <div>📅 Date souhaitée : <strong>{new Date(r.date).toLocaleDateString('fr-FR', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}</strong></div>
                  {r.heure && r.heure !== '00:00:00' && (
                    <div>🕐 Heure fixée : <strong style={{ color: '#2563eb' }}>
                      {r.heure.substring(0, 5)}
                    </strong></div>
                  )}
                  {r.motif && (
                    <div>📝 Motif : {r.motif.substring(0, 100)}</div>
                  )}
                </div>

                {/* BOUTON APPELER - toujours visible */}
                <button onClick={() => window.open(`tel:${r.telephone}`)}
                  style={{ width: '100%', padding: '12px',
                    background: '#0f172a', color: 'white',
                    border: 'none', borderRadius: '10px',
                    cursor: 'pointer', fontWeight: '700',
                    fontSize: '14px', marginBottom: '10px',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px' }}>
                  📞 Appeler {r.nom_patient} — {r.telephone}
                </button>

                {/* ACTIONS SELON STATUT */}
                {r.statut === 'en_attente' && (
                  <div>
                    {/* FIXER L'HEURE */}
                    <div style={{ background: '#eff6ff', borderRadius: '12px',
                      padding: '14px', marginBottom: '10px',
                      border: '2px solid #2563eb' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700',
                        color: '#1d4ed8', marginBottom: '8px' }}>
                        🕐 Fixez l'heure du rendez-vous *
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280',
                        marginBottom: '8px' }}>
                        Choisissez l'heure qui convient pour ce jour ou le lendemain
                      </div>
                      <input type="time"
                        id={`heure-${r.id}`}
                        defaultValue="08:00"
                        style={{ width: '100%', padding: '12px',
                          borderRadius: '8px', border: '2px solid #2563eb',
                          boxSizing: 'border-box', fontSize: '18px',
                          fontWeight: '800', textAlign: 'center',
                          color: '#1d4ed8', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => {
                        const heure = document.getElementById(`heure-${r.id}`).value;
                        if (!heure) { alert('Veuillez fixer une heure !'); return; }
                        traiterRDV(r.id, 'confirme', heure);
                      }}
                        style={{ flex: 2, padding: '12px', background: '#16a34a',
                          color: 'white', border: 'none', borderRadius: '10px',
                          cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                        ✅ Confirmer à cette heure
                      </button>
                      <button onClick={() => traiterRDV(r.id, 'annule')}
                        style={{ flex: 1, padding: '12px', background: '#dc2626',
                          color: 'white', border: 'none', borderRadius: '10px',
                          cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                        ❌ Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* SI CONFIRMÉ */}
                {r.statut === 'confirme' && (
                  <div style={{ background: '#dcfce7', borderRadius: '12px',
                    padding: '14px', textAlign: 'center',
                    border: '2px solid #16a34a' }}>
                    <div style={{ fontSize: '12px', color: '#16a34a',
                      fontWeight: '700', marginBottom: '4px' }}>
                      ✅ RENDEZ-VOUS CONFIRMÉ
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800',
                      color: '#16a34a' }}>
                      🕐 {r.heure ? r.heure.substring(0, 5) : 'Heure non définie'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      {new Date(r.date).toLocaleDateString('fr-FR', {
                        weekday: 'long', day: 'numeric', month: 'long'
                      })}
                    </div>
                  </div>
                )}

                {/* SI ANNULÉ */}
                {r.statut === 'annule' && (
                  <div style={{ background: '#fee2e2', borderRadius: '12px',
                    padding: '12px', textAlign: 'center' }}>
                    <div style={{ color: '#dc2626', fontWeight: '700', fontSize: '13px' }}>
                      ❌ Rendez-vous annulé — Contactez le patient si nécessaire
                    </div>
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

            <div style={{ background: 'white', borderRadius: '16px', padding: '16px',
              marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h4 style={{ color: '#0f172a', marginBottom: '12px' }}>
                ➕ Ajouter un médecin
              </h4>
              <input placeholder="Nom du médecin *"
                value={nouveauMedecin.nom}
                onChange={e => setNouveauMedecin({...nouveauMedecin, nom: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px',
                  border: '2px solid #e2e8f0', marginBottom: '8px',
                  boxSizing: 'border-box', fontSize: '14px' }} />
              <input placeholder="Spécialité *"
                value={nouveauMedecin.specialite}
                onChange={e => setNouveauMedecin({...nouveauMedecin, specialite: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px',
                  border: '2px solid #e2e8f0', marginBottom: '8px',
                  boxSizing: 'border-box', fontSize: '14px' }} />
              <input placeholder="Téléphone *"
                value={nouveauMedecin.telephone}
                onChange={e => setNouveauMedecin({...nouveauMedecin, telephone: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px',
                  border: '2px solid #e2e8f0', marginBottom: '8px',
                  boxSizing: 'border-box', fontSize: '14px' }} />
              <select
                value={nouveauMedecin.service_id || ''}
                onChange={e => setNouveauMedecin({...nouveauMedecin, service_id: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px',
                  border: '2px solid #e2e8f0', marginBottom: '8px',
                  boxSizing: 'border-box', fontSize: '14px', cursor: 'pointer' }}>
                <option value="">Service (optionnel)</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
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
                ➕ Ajouter le médecin
              </button>
            </div>

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
                  alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: '800', color: '#0f172a' }}>{m.nom}</div>
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>{m.specialite}</div>
                    {m.service && (
                      <div style={{ color: '#7c3aed', fontSize: '12px', fontWeight: '600' }}>
                        ⚕️ {m.service}
                      </div>
                    )}
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>
                      🕐 {m.heure_debut} - {m.heure_fin} · 📅 {m.jours_travail}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexDirection: 'column',
                    alignItems: 'flex-end' }}>
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
                {/* Appeler le médecin */}
                {m.telephone && (
                  <button onClick={() => window.open(`tel:${m.telephone}`)}
                    style={{ width: '100%', padding: '8px', background: '#f0f7ff',
                      color: '#2563eb', border: '1px solid #2563eb',
                      borderRadius: '8px', cursor: 'pointer',
                      fontWeight: '700', fontSize: '12px' }}>
                    📞 Appeler {m.nom} — {m.telephone}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ONGLET SERVICES */}
        {activeTab === 'services' && (
          <div>
            <h3 style={{ color: '#0f172a', marginBottom: '16px' }}>
              ⚕️ Gestion des services
            </h3>

            <div style={{ background: 'white', borderRadius: '16px', padding: '16px',
              marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h4 style={{ color: '#0f172a', marginBottom: '12px' }}>
                ➕ Ajouter un service
              </h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input placeholder="Ex: Cardiologie, Neurologie..."
                  value={nouveauService}
                  onChange={e => setNouveauService(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && ajouterService()}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px',
                    border: '2px solid #e2e8f0', fontSize: '14px', outline: 'none' }} />
                <button onClick={ajouterService}
                  style={{ padding: '10px 16px', background: '#0f172a',
                    color: 'white', border: 'none', borderRadius: '8px',
                    cursor: 'pointer', fontWeight: '700' }}>
                  ➕
                </button>
              </div>
            </div>

            {services.length === 0 && (
              <div style={{ background: 'white', borderRadius: '16px',
                padding: '30px', textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚕️</div>
                <div style={{ color: '#6b7280' }}>Aucun service enregistré</div>
              </div>
            )}
            {services.map(s => (
              <div key={s.id} style={{ background: 'white', borderRadius: '16px',
                padding: '16px', marginBottom: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${s.available ? '#16a34a' : '#ef4444'}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '15px' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '12px', marginTop: '4px',
                    color: s.available ? '#16a34a' : '#dc2626', fontWeight: '600' }}>
                    {s.available ? '✅ Disponible' : '❌ Indisponible'}
                  </div>
                </div>
                <button onClick={() => toggleService(s)}
                  style={{ padding: '10px 16px', border: 'none', borderRadius: '50px',
                    cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                    background: s.available ? '#fee2e2' : '#dcfce7',
                    color: s.available ? '#dc2626' : '#16a34a' }}>
                  {s.available ? '❌ Désactiver' : '✅ Activer'}
                </button>
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