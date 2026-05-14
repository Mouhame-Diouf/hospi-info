import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://MouhaemedDiouf221.pythonanywhere.com';

function SuperAdmin() {
  const [authentifie, setAuthentifie] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [demandes, setDemandes] = useState([]);
  const [hopitaux, setHopitaux] = useState([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('demandes');
  const [hopitalEdite, setHopitalEdite] = useState(null);
  const navigate = useNavigate();

  const login = () => {
    if (password === 'superadmin2026') {
      setAuthentifie(true);
      setError('');
    } else {
      setError('Mot de passe incorrect.');
    }
  };

  useEffect(() => {
    if (authentifie) {
      chargerDonnees();
    }
  }, [authentifie]);

  const chargerDonnees = async () => {
    try {
      const [resDemandes, resHopitaux] = await Promise.all([
        axios.get(`${API}/api/demandes/`),
        axios.get(`${API}/api/hospitals/`)
      ]);
      setDemandes(resDemandes.data);
      setHopitaux(resHopitaux.data);
    } catch (err) {
      console.error(err);
    }
  };

  const approuver = async (id) => {
    try {
      const res = await axios.patch(`${API}/api/demandes/${id}/`, { statut: 'approuve' });
      setMessage('✅ ' + res.data.message);
      setDemandes(demandes.map(d => d.id === id ? { ...d, statut: 'approuve' } : d));
      chargerDonnees();
    } catch {
      setMessage('❌ Erreur lors de l\'approbation.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const rejeter = async (id) => {
    try {
      const res = await axios.patch(`${API}/api/demandes/${id}/`, { statut: 'rejete' });
      setMessage('❌ ' + res.data.message);
      setDemandes(demandes.map(d => d.id === id ? { ...d, statut: 'rejete' } : d));
    } catch {
      setMessage('❌ Erreur lors du rejet.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const supprimerHopital = async (id, nom) => {
    if (!window.confirm(`Supprimer l'hôpital "${nom}" ? Cette action est irréversible !`)) return;
    try {
      await axios.delete(`${API}/api/hospitals/${id}/delete/`);
      setHopitaux(hopitaux.filter(h => h.id !== id));
      setMessage(`✅ Hôpital "${nom}" supprimé !`);
    } catch {
      setMessage('❌ Erreur suppression.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const modifierHopital = async () => {
    try {
      await axios.patch(`${API}/api/hospitals/${hopitalEdite.id}/update/`, {
        name: hopitalEdite.name,
        city: hopitalEdite.city,
        address: hopitalEdite.address,
        phone: hopitalEdite.phone,
        email: hopitalEdite.email,
        total_beds: hopitalEdite.total_beds,
        available_beds: hopitalEdite.available_beds,
      });
      setHopitaux(hopitaux.map(h => h.id === hopitalEdite.id ? hopitalEdite : h));
      setHopitalEdite(null);
      setMessage('✅ Hôpital mis à jour !');
    } catch {
      setMessage('❌ Erreur modification.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const enAttente = demandes.filter(d => d.statut === 'en_attente').length;
  const approuves = demandes.filter(d => d.statut === 'approuve').length;

  if (!authentifie) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif',
        padding: '20px'
      }}>
        <div style={{
          background: 'white', borderRadius: '24px', padding: '40px',
          width: '100%', maxWidth: '380px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '3rem' }}>⚙️</div>
            <h1 style={{ color: '#0f172a', fontSize: '1.6rem',
              fontWeight: '800', marginBottom: '6px' }}>
              Super Admin
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Accès réservé aux administrateurs
            </p>
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#dc2626',
              padding: '12px', borderRadius: '12px',
              marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#374151', fontSize: '14px', fontWeight: '700' }}>
              Mot de passe administrateur
            </label>
            <input type="password" placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && login()}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px',
                border: '2px solid #e2e8f0', fontSize: '15px', marginTop: '6px',
                outline: 'none', boxSizing: 'border-box', background: '#f8fafc' }} />
          </div>

          <button onClick={login}
            style={{ width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #0f172a, #2563eb)',
              color: 'white', border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              marginBottom: '16px' }}>
            Accéder →
          </button>

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none',
                color: '#6b7280', cursor: 'pointer', fontSize: '13px' }}>
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8',
      fontFamily: 'Segoe UI, sans-serif' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
        padding: '16px 20px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: 'white', fontWeight: '800', fontSize: '1.2rem' }}>
            ⚙️ Super Admin — HOSPI-INFO
          </div>
          <div style={{ color: '#4ade80', fontSize: '11px', fontWeight: '600' }}>
            ● Panneau de contrôle
          </div>
        </div>
        <button onClick={() => navigate('/home')}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', padding: '8px 16px', borderRadius: '50px',
            cursor: 'pointer', fontSize: '13px' }}>
          ← Accueil
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
        gap: '10px', margin: '16px' }}>
        {[
          { label: 'Hôpitaux', value: hopitaux.length, color: '#2563eb', icon: '🏥' },
          { label: 'Demandes', value: demandes.length, color: '#7c3aed', icon: '📋' },
          { label: 'En attente', value: enAttente, color: '#d97706', icon: '⏳' },
          { label: 'Approuvés', value: approuves, color: '#16a34a', icon: '✅' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '16px',
            padding: '12px', textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '1.2rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: '10px', color: '#6b7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', margin: '0 16px 16px', background: 'white',
        borderRadius: '16px', padding: '6px', gap: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {[
          { id: 'demandes', label: `📋 Demandes (${demandes.length})` },
          { id: 'hopitaux', label: `🏥 Hôpitaux (${hopitaux.length})` },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '12px',
              cursor: 'pointer', fontWeight: '700', fontSize: '13px',
              background: activeTab === tab.id ? '#0f172a' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#6b7280' }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>

        {/* ONGLET DEMANDES */}
        {activeTab === 'demandes' && (
          <div>
            <h3 style={{ color: '#0f172a', marginBottom: '16px' }}>
              📋 Demandes d'inscription
            </h3>
            {demandes.length === 0 && (
              <div style={{ background: 'white', borderRadius: '16px',
                padding: '40px', textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>📭</div>
                <div style={{ color: '#6b7280' }}>Aucune demande</div>
              </div>
            )}
            {demandes.map(d => (
              <div key={d.id} style={{ background: 'white', borderRadius: '16px',
                padding: '16px', marginBottom: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${d.statut === 'approuve' ? '#16a34a' :
                  d.statut === 'rejete' ? '#dc2626' : '#d97706'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '800', color: '#0f172a',
                      fontSize: '1rem' }}>{d.nom}</div>
                    <div style={{ color: '#6b7280', fontSize: '13px' }}>
                      📍 {d.ville} · 👤 {d.responsable}
                    </div>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '50px',
                    fontSize: '11px', fontWeight: '700',
                    background: d.statut === 'approuve' ? '#dcfce7' :
                      d.statut === 'rejete' ? '#fee2e2' : '#fef3c7',
                    color: d.statut === 'approuve' ? '#16a34a' :
                      d.statut === 'rejete' ? '#dc2626' : '#d97706' }}>
                    {d.statut === 'approuve' ? '✅ Approuvé' :
                      d.statut === 'rejete' ? '❌ Rejeté' : '⏳ En attente'}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#6b7280',
                  marginBottom: '12px', lineHeight: '1.8' }}>
                  <div>📞 {d.telephone} · ✉️ {d.email}</div>
                  <div>🛏️ {d.totalLits} lits</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    {d.services && d.services.map(s => (
                      <span key={s} style={{ background: '#eff6ff', color: '#2563eb',
                        padding: '2px 8px', borderRadius: '20px', fontSize: '11px' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {d.statut === 'en_attente' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => approuver(d.id)}
                      style={{ flex: 1, padding: '10px', background: '#16a34a',
                        color: 'white', border: 'none', borderRadius: '10px',
                        cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                      ✅ Approuver
                    </button>
                    <button onClick={() => rejeter(d.id)}
                      style={{ flex: 1, padding: '10px', background: '#dc2626',
                        color: 'white', border: 'none', borderRadius: '10px',
                        cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                      ❌ Rejeter
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ONGLET HÔPITAUX */}
        {activeTab === 'hopitaux' && (
          <div>
            <h3 style={{ color: '#0f172a', marginBottom: '16px' }}>
              🏥 Tous les hôpitaux
            </h3>
            {hopitaux.length === 0 && (
              <div style={{ background: 'white', borderRadius: '16px',
                padding: '40px', textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏥</div>
                <div style={{ color: '#6b7280' }}>Aucun hôpital enregistré</div>
              </div>
            )}
            {hopitaux.map(h => (
              <div key={h.id} style={{ background: 'white', borderRadius: '16px',
                padding: '16px', marginBottom: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${h.available_beds > 0 ? '#16a34a' : '#dc2626'}` }}>

                {hopitalEdite?.id === h.id ? (
                  /* MODE ÉDITION */
                  <div>
                    <h4 style={{ color: '#0f172a', marginBottom: '12px' }}>
                      ✏️ Modifier {h.name}
                    </h4>
                    {[
                      { label: 'Nom', field: 'name' },
                      { label: 'Ville', field: 'city' },
                      { label: 'Adresse', field: 'address' },
                      { label: 'Téléphone', field: 'phone' },
                      { label: 'Email', field: 'email' },
                    ].map(f => (
                      <div key={f.field} style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '12px', color: '#6b7280',
                          fontWeight: '700' }}>{f.label}</label>
                        <input value={hopitalEdite[f.field] || ''}
                          onChange={e => setHopitalEdite({
                            ...hopitalEdite, [f.field]: e.target.value
                          })}
                          style={{ width: '100%', padding: '8px 12px',
                            borderRadius: '8px', border: '2px solid #e2e8f0',
                            boxSizing: 'border-box', fontSize: '14px',
                            marginTop: '2px', outline: 'none' }} />
                      </div>
                    ))}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
                      gap: '8px', marginBottom: '12px' }}>
                      <div>
                        <label style={{ fontSize: '12px', color: '#6b7280',
                          fontWeight: '700' }}>Lits totaux</label>
                        <input type="number"
                          value={hopitalEdite.total_beds || ''}
                          onChange={e => setHopitalEdite({
                            ...hopitalEdite, total_beds: parseInt(e.target.value)
                          })}
                          style={{ width: '100%', padding: '8px 12px',
                            borderRadius: '8px', border: '2px solid #e2e8f0',
                            boxSizing: 'border-box', fontSize: '14px',
                            marginTop: '2px', outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', color: '#6b7280',
                          fontWeight: '700' }}>Lits disponibles</label>
                        <input type="number"
                          value={hopitalEdite.available_beds || ''}
                          onChange={e => setHopitalEdite({
                            ...hopitalEdite, available_beds: parseInt(e.target.value)
                          })}
                          style={{ width: '100%', padding: '8px 12px',
                            borderRadius: '8px', border: '2px solid #e2e8f0',
                            boxSizing: 'border-box', fontSize: '14px',
                            marginTop: '2px', outline: 'none' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={modifierHopital}
                        style={{ flex: 1, padding: '10px', background: '#16a34a',
                          color: 'white', border: 'none', borderRadius: '10px',
                          cursor: 'pointer', fontWeight: '700' }}>
                        💾 Sauvegarder
                      </button>
                      <button onClick={() => setHopitalEdite(null)}
                        style={{ flex: 1, padding: '10px', background: '#f1f5f9',
                          color: '#374151', border: 'none', borderRadius: '10px',
                          cursor: 'pointer', fontWeight: '700' }}>
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  /* MODE AFFICHAGE */
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '800', color: '#0f172a',
                          fontSize: '1rem' }}>{h.name}</div>
                        <div style={{ color: '#6b7280', fontSize: '13px' }}>
                          📍 {h.city}
                        </div>
                        {h.email && (
                          <div style={{ color: '#6b7280', fontSize: '13px' }}>
                            ✉️ {h.email}
                          </div>
                        )}
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: '50px',
                        fontSize: '11px', fontWeight: '700',
                        background: h.available_beds > 0 ? '#dcfce7' : '#fee2e2',
                        color: h.available_beds > 0 ? '#16a34a' : '#dc2626' }}>
                        {h.available_beds > 0 ? '✅ Disponible' : '❌ Complet'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px',
                      marginBottom: '12px', flexWrap: 'wrap' }}>
                      <span style={{ background: '#eff6ff', color: '#2563eb',
                        padding: '4px 10px', borderRadius: '50px',
                        fontSize: '12px', fontWeight: '600' }}>
                        🛏️ {h.available_beds}/{h.total_beds} lits
                      </span>
                      <span style={{ background: '#f3f4f6', color: '#374151',
                        padding: '4px 10px', borderRadius: '50px',
                        fontSize: '12px', fontWeight: '600' }}>
                        📊 {h.occupancy_rate}% occupation
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setHopitalEdite({...h})}
                        style={{ flex: 1, padding: '10px', background: '#eff6ff',
                          color: '#2563eb', border: 'none', borderRadius: '10px',
                          cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                        ✏️ Modifier
                      </button>
                      <button onClick={() => supprimerHopital(h.id, h.name)}
                        style={{ flex: 1, padding: '10px', background: '#fee2e2',
                          color: '#dc2626', border: 'none', borderRadius: '10px',
                          cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}>
                        🗑️ Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SuperAdmin;