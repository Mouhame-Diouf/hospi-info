import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: '👋 Bonjour ! Je suis l\'assistant HOSPI-INFO. Je peux répondre à toutes vos questions sur les hôpitaux au Sénégal, la santé, les urgences et bien plus. Comment puis-je vous aider ?',
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://MouhaemedDiouf221.pythonanywhere.com/api/hospitals/')
      .then(res => setHospitals(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const repondreBot = (question) => {
    const q = question.toLowerCase().trim();

    // Salutations
    if (q.match(/^(bonjour|salut|bonsoir|hello|hi|hey|salam|assalam|coucou)/)) {
      return '👋 Bonjour ! Je suis l\'assistant HOSPI-INFO. Je suis là pour vous aider avec tout ce qui concerne les hôpitaux au Sénégal. Que puis-je faire pour vous ?';
    }

    // Remerciements
    if (q.match(/(merci|thank|super|parfait|excellent|bravo|génial)/)) {
      return '😊 De rien ! Je suis toujours là si vous avez d\'autres questions. Prenez soin de vous !';
    }

    // Comment ça va
    if (q.match(/(comment.*(vas|allez|tu|vous)|ça va|ca va)/)) {
      return '😊 Je vais très bien merci ! Je suis prêt à vous aider. Avez-vous besoin d\'informations sur les hôpitaux ?';
    }

    // Urgences
    if (q.match(/(urgence|urgent|emergency|vite|rapidement|immédiat|critique|grave|danger)/)) {
      const urgences = hospitals.filter(h =>
        h.available_beds > 0 &&
        h.services && h.services.some(s => s.name.toLowerCase().includes('urgence') && s.available)
      );
      if (urgences.length > 0) {
        return `🚨 URGENCE - Hôpitaux avec urgences disponibles :\n${urgences.map(h =>
          `• ${h.name}\n  📍 ${h.city}\n  📞 ${h.phone || 'Non disponible'}\n  🛏️ ${h.available_beds} lits`).join('\n\n')}\n\n⚠️ En cas d'urgence grave appelez le 15 (SAMU) ou le 18 (Pompiers) !`;
      }
      return '🚨 En cas d\'urgence grave :\n• Appelez le **15** (SAMU)\n• Appelez le **18** (Pompiers)\n• Appelez le **17** (Police)\n\nJe vérifie les hôpitaux disponibles...';
    }

    // Maternité / accouchement
    if (q.match(/(maternité|accouchement|bébé|grossesse|enceinte|naissance|gynéco|femme enceinte)/)) {
      const maternite = hospitals.filter(h =>
        h.available_beds > 0 &&
        h.services && h.services.some(s => s.name.toLowerCase().includes('maternité') && s.available)
      );
      if (maternite.length > 0) {
        return `🤱 Maternités disponibles :\n${maternite.map(h =>
          `• ${h.name}\n  📍 ${h.city}\n  📞 ${h.phone || 'Non disponible'}`).join('\n\n')}`;
      }
      return '🤱 Aucune maternité disponible actuellement. Appelez le 15 pour une assistance immédiate.';
    }

    // Pédiatrie / enfants
    if (q.match(/(pédiatrie|enfant|bébé malade|nourrisson|pediatre)/)) {
      const pediatrie = hospitals.filter(h =>
        h.available_beds > 0 &&
        h.services && h.services.some(s => s.name.toLowerCase().includes('pédiatrie') && s.available)
      );
      if (pediatrie.length > 0) {
        return `👶 Services pédiatrie disponibles :\n${pediatrie.map(h =>
          `• ${h.name} — 📍 ${h.city}`).join('\n')}`;
      }
      return '👶 Aucun service pédiatrie disponible actuellement.';
    }

    // Chirurgie
    if (q.match(/(chirurgie|opération|operer|bloc opératoire|chirurgien)/)) {
      const chirurgie = hospitals.filter(h =>
        h.available_beds > 0 &&
        h.services && h.services.some(s => s.name.toLowerCase().includes('chirurgie') && s.available)
      );
      if (chirurgie.length > 0) {
        return `🏥 Services chirurgie disponibles :\n${chirurgie.map(h =>
          `• ${h.name} — 📍 ${h.city}`).join('\n')}`;
      }
      return '🏥 Aucun service chirurgie disponible actuellement.';
    }

    // Cardiologie / coeur
    if (q.match(/(cardiologie|coeur|cœur|cardiaque|cardiologue|infarctus|tension)/)) {
      const cardio = hospitals.filter(h =>
        h.available_beds > 0 &&
        h.services && h.services.some(s => s.name.toLowerCase().includes('cardiologie') && s.available)
      );
      if (cardio.length > 0) {
        return `❤️ Services cardiologie disponibles :\n${cardio.map(h =>
          `• ${h.name} — 📍 ${h.city}`).join('\n')}`;
      }
      return '❤️ Aucun service cardiologie disponible. En cas d\'urgence cardiaque, appelez le 15 !';
    }

    // Lits / disponibilité
    if (q.match(/(lit|place|disponible|disponibilité|chambre|hospitalisation)/)) {
      const total = hospitals.reduce((acc, h) => acc + h.available_beds, 0);
      const dispo = hospitals.filter(h => h.available_beds > 0);
      const complet = hospitals.filter(h => h.available_beds === 0);
      return `🛏️ Situation des lits en ce moment :\n\n✅ ${total} lits disponibles au total\n✅ ${dispo.length} hôpitaux avec des places :\n${dispo.map(h => `  • ${h.name} : ${h.available_beds} lits`).join('\n')}\n\n❌ ${complet.length} hôpitaux complets :\n${complet.map(h => `  • ${h.name}`).join('\n')}`;
    }

    // Hôpital le plus proche
    if (q.match(/(proche|près|nearest|autour|proximité)/)) {
      const dispo = hospitals.filter(h => h.available_beds > 0);
      if (dispo.length > 0) {
        return `📍 Hôpitaux disponibles :\n${dispo.map(h =>
          `• ${h.name}\n  📍 ${h.city}\n  🛏️ ${h.available_beds} lits\n  📞 ${h.phone || 'Non disponible'}`).join('\n\n')}\n\nCliquez sur "Trajet" sur la carte pour obtenir l'itinéraire !`;
      }
      return '😔 Aucun hôpital disponible pour le moment.';
    }

    // Par ville
    const villes = ['dakar', 'thiès', 'thies', 'saint-louis', 'ziguinchor', 'kaolack', 'rufisque', 'pikine', 'guédiawaye'];
    for (const ville of villes) {
      if (q.includes(ville)) {
        const hopVille = hospitals.filter(h =>
          h.city.toLowerCase().includes(ville) && h.available_beds > 0
        );
        if (hopVille.length > 0) {
          return `🏥 Hôpitaux disponibles à ${ville.charAt(0).toUpperCase() + ville.slice(1)} :\n${hopVille.map(h =>
            `• ${h.name}\n  🛏️ ${h.available_beds} lits\n  📞 ${h.phone || 'Non disponible'}`).join('\n\n')}`;
        }
        return `😔 Aucun hôpital disponible à ${ville} pour le moment.`;
      }
    }

    // Numéros d'urgence
    if (q.match(/(numéro|numero|appeler|téléphone|telephone|samu|pompier|police|contact)/)) {
      return `📞 Numéros d'urgence au Sénégal :\n\n🚑 SAMU : **15**\n🚒 Pompiers : **18**\n👮 Police : **17**\n🏥 Croix-Rouge : **33 823 27 22**\n\n📞 Contacts des hôpitaux :\n${hospitals.filter(h => h.phone).map(h =>
        `• ${h.name} : ${h.phone}`).join('\n')}`;
    }

    // Liste hôpitaux
    if (q.match(/(liste|tous|hôpitaux|hopitaux|combien|nombre)/)) {
      return `🏥 Les ${hospitals.length} hôpitaux sur HOSPI-INFO :\n\n${hospitals.map(h =>
        `${h.available_beds > 0 ? '✅' : '❌'} ${h.name}\n  📍 ${h.city} | 🛏️ ${h.available_beds}/${h.total_beds} lits`).join('\n\n')}`;
    }

    // Statistiques
    if (q.match(/(statistique|stat|taux|occupation|pourcentage)/)) {
      const totalLits = hospitals.reduce((acc, h) => acc + h.total_beds, 0);
      const litsLibres = hospitals.reduce((acc, h) => acc + h.available_beds, 0);
      const tauxOccupation = Math.round((totalLits - litsLibres) / totalLits * 100);
      return `📊 Statistiques HOSPI-INFO :\n\n🏥 ${hospitals.length} hôpitaux\n🛏️ ${totalLits} lits au total\n✅ ${litsLibres} lits disponibles\n❌ ${totalLits - litsLibres} lits occupés\n📈 Taux d'occupation : ${tauxOccupation}%`;
    }

    // Inscription hôpital
    if (q.match(/(inscrire|inscription|rejoindre|ajouter|enregistrer|intégrer)/)) {
      return '🏥 Pour inscrire votre hôpital sur HOSPI-INFO :\n\n1. Allez sur la page d\'accueil\n2. Cliquez sur "🏥 Inscrire mon hôpital"\n3. Remplissez le formulaire\n4. Un administrateur validera votre demande sous 24h\n\nVotre hôpital sera ensuite visible sur la carte !';
    }

    // COVID / maladies
    if (q.match(/(covid|coronavirus|paludisme|malaria|tuberculose|maladie|infection)/)) {
      return '🦠 Pour les maladies infectieuses au Sénégal :\n\n• Contactez votre médecin traitant\n• Appelez le 15 (SAMU) en cas d\'urgence\n• Visitez le site du Ministère de la Santé du Sénégal\n\nJe peux vous aider à trouver un hôpital disponible pour une consultation.';
    }

    // Prix / coût
    if (q.match(/(prix|coût|cout|tarif|gratuit|payer|argent|consultation|frais)/)) {
      return '💰 Pour les tarifs des hôpitaux :\n\n• Les hôpitaux publics au Sénégal ont des tarifs réglementés\n• La consultation coûte généralement entre 500 et 2000 FCFA\n• Les urgences sont prioritaires quel que soit le moyen de paiement\n\nContactez directement l\'hôpital pour plus d\'informations sur les tarifs.';
    }

    // Ambulance
    if (q.match(/(ambulance|transport|véhicule|conduire)/)) {
      return '🚑 Pour une ambulance au Sénégal :\n\n• Appelez le **15** (SAMU) pour une ambulance médicalisée\n• Appelez le **18** (Pompiers) pour une ambulance de secours\n• Certains hôpitaux ont leur propre service d\'ambulance\n\nSur HOSPI-INFO vous pouvez voir l\'hôpital le plus proche sur la carte !';
    }

    // Qui es-tu
    if (q.match(/(qui es.tu|qui êtes.vous|c'est quoi|c'est qui|assistant|robot|bot)/)) {
      return '🤖 Je suis l\'assistant virtuel de HOSPI-INFO !\n\nJe peux vous aider avec :\n• 🏥 Trouver un hôpital disponible\n• 🚨 Localiser les urgences\n• 🛏️ Vérifier les lits disponibles\n• 📍 Chercher par ville\n• 📞 Obtenir des contacts\n• 💊 Conseils santé généraux\n• Et bien plus encore !';
    }

    // Aide générale
    if (q.match(/(aide|help|quoi|que|comment|pourquoi)/)) {
      return '🆘 Je peux vous aider avec :\n\n🏥 **Hôpitaux** — Trouver un hôpital disponible\n🚨 **Urgences** — Localiser les urgences\n🤱 **Maternité** — Trouver une maternité\n👶 **Pédiatrie** — Services pour enfants\n🛏️ **Lits** — Disponibilité en temps réel\n📍 **Ville** — Chercher par ville\n📞 **Contacts** — Numéros importants\n📊 **Stats** — Statistiques générales\n\nPosez-moi votre question !';
    }

    // Réponse par défaut intelligente
    return `🤔 Je comprends votre question sur "${question}".\n\nVoici ce que je peux vous dire :\n• Il y a actuellement **${hospitals.filter(h => h.available_beds > 0).length} hôpitaux disponibles** au Sénégal\n• **${hospitals.reduce((acc, h) => acc + h.available_beds, 0)} lits libres** en ce moment\n\nPour plus d'aide, essayez :\n• "Urgences disponibles"\n• "Hôpital le plus proche"\n• "Lits à Dakar"\n• "Numéros d'urgence"`;
  };

  const envoyerMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      time: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, newMessage]);
    const questionPosee = input;
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const reponse = repondreBot(questionPosee);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        type: 'bot',
        text: reponse,
        time: new Date().toLocaleTimeString()
      }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url(/hospi-info.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      position: 'relative'
    }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(0,40,100,0.85) 0%, rgba(0,100,160,0.75) 100%)',
        zIndex: 0
      }}></div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto',
        padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* HEADER */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px',
          padding: '16px 20px', marginBottom: '16px', display: 'flex',
          alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate('/home')}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none',
              color: 'white', padding: '8px 16px', borderRadius: '50px', cursor: 'pointer' }}>
            ⬅
          </button>
          <div style={{ fontSize: '2rem' }}>🤖</div>
          <div>
            <div style={{ color: 'white', fontWeight: '700', fontSize: '1.1rem' }}>
              Assistant HOSPI-INFO
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              🟢 En ligne — Répond instantanément
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px',
          display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map(m => (
            <div key={m.id} style={{
              display: 'flex',
              justifyContent: m.type === 'user' ? 'flex-end' : 'flex-start'
            }}>
              {m.type === 'bot' && (
                <div style={{ fontSize: '1.5rem', marginRight: '8px', alignSelf: 'flex-end' }}>🤖</div>
              )}
              <div style={{
                maxWidth: '75%',
                background: m.type === 'user' ? '#1d72b8' : 'rgba(255,255,255,0.95)',
                color: m.type === 'user' ? 'white' : '#1a3a6b',
                padding: '12px 16px',
                borderRadius: m.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                whiteSpace: 'pre-line',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                {m.text}
                <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '4px',
                  textAlign: m.type === 'user' ? 'right' : 'left' }}>
                  {m.time}
                </div>
              </div>
              {m.type === 'user' && (
                <div style={{ fontSize: '1.5rem', marginLeft: '8px', alignSelf: 'flex-end' }}>👤</div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ fontSize: '1.5rem' }}>🤖</div>
              <div style={{ background: 'rgba(255,255,255,0.95)', padding: '12px 16px',
                borderRadius: '18px 18px 18px 4px', color: '#888', fontSize: '14px' }}>
                ⏳ En train de répondre...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* SUGGESTIONS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          {['🚨 Urgences', '🛏️ Lits disponibles', '📍 Hôpital proche', '📞 Numéros urgence', '📊 Statistiques'].map(s => (
            <button key={s}
              onClick={() => {
                setInput(s.replace(/^[^\s]+\s/, ''));
                setTimeout(() => {
                  const q = s.replace(/^[^\s]+\s/, '');
                  const msg = { id: messages.length + 1, type: 'user', text: q, time: new Date().toLocaleTimeString() };
                  setMessages(prev => [...prev, msg]);
                  setLoading(true);
                  setTimeout(() => {
                    setMessages(prev => [...prev, {
                      id: prev.length + 1, type: 'bot',
                      text: repondreBot(q),
                      time: new Date().toLocaleTimeString()
                    }]);
                    setLoading(false);
                    setInput('');
                  }, 800);
                }, 100);
              }}
              style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)',
                color: 'white', padding: '6px 14px', borderRadius: '50px', cursor: 'pointer',
                fontSize: '12px' }}>
              {s}
            </button>
          ))}
        </div>

        {/* INPUT */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Posez n'importe quelle question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && envoyerMessage()}
            style={{ flex: 1, padding: '14px 20px', borderRadius: '50px',
              border: 'none', fontSize: '15px', outline: 'none',
              background: 'rgba(255,255,255,0.95)' }}
          />
          <button onClick={envoyerMessage}
            style={{ background: '#1d72b8', color: 'white', border: 'none',
              width: '52px', height: '52px', borderRadius: '50%', cursor: 'pointer',
              fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ➤
          </button>
        </div>

      </div>
    </div>
  );
}

export default Chat;