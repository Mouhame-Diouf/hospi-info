import React, { useEffect, useRef } from 'react';

function MapView({ hospitals }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!hospitals || hospitals.length === 0) return;
    if (mapInstanceRef.current) return;
    if (!mapRef.current) return;

    const initMap = () => {
      const L = window.L;
      if (!L) { setTimeout(initMap, 300); return; }

      mapInstanceRef.current = L.map(mapRef.current).setView([14.6928, -17.4467], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapInstanceRef.current);

      // Marqueurs hôpitaux
      hospitals.filter(h => h.latitude && h.longitude).forEach(h => {
        const color = h.available_beds > 0 ? '#2ecc71' : '#e74c3c';
        const icon = L.divIcon({
          html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.5);font-size:15px;line-height:26px;text-align:center;">🏥</div>`,
          className: '', iconSize: [28, 28], iconAnchor: [14, 14]
        });

        L.marker([h.latitude, h.longitude], { icon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <div style="font-family:Segoe UI;min-width:180px;padding:4px">
              <strong style="color:#1a3a6b">${h.name}</strong><br/>
              <span style="color:#888">📍 ${h.city}</span><br/><br/>
              🛏️ <strong style="color:#1d72b8">${h.available_beds}</strong> lits disponibles<br/><br/>
              <button onclick="window.tracerTrajet(${h.latitude}, ${h.longitude}, '${h.name}')"
                style="background:#1d72b8;color:white;border:none;padding:6px 14px;border-radius:20px;cursor:pointer;font-size:13px;">
                🗺️ Trajet depuis ma position
              </button>
            </div>
          `);
      });

      // Fonction trajet
      window.tracerTrajet = (lat, lng, nom) => {
        if (!navigator.geolocation) {
          alert('Géolocalisation non supportée par votre navigateur.');
          return;
        }
        navigator.geolocation.getCurrentPosition(pos => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          const map = mapInstanceRef.current;

          // Marqueur utilisateur
          const userIcon = L.divIcon({
            html: `<div style="background:#f39c12;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
            className: '', iconSize: [20, 20], iconAnchor: [10, 10]
          });
          L.marker([userLat, userLng], { icon: userIcon })
            .addTo(map)
            .bindPopup('📍 Votre position').openPopup();

          // Ligne droite entre les deux points
          const ligne = L.polyline(
            [[userLat, userLng], [lat, lng]],
            { color: '#1d72b8', weight: 4, dashArray: '8, 8', opacity: 0.8 }
          ).addTo(map);

          // Centrer la carte sur les deux points
          map.fitBounds(ligne.getBounds(), { padding: [40, 40] });

          // Lien Google Maps
          const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${lat},${lng}`;
          window.open(url, '_blank');

        }, () => {
          alert('Impossible d\'obtenir votre position. Vérifiez les permissions GPS.');
        });
      };
    };

    initMap();
  }, [hospitals]);

  return (
    <div ref={mapRef} style={{ height: '400px', width: '100%', zIndex: 0 }} />
  );
}

export default MapView;