import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import HospitalDetail from './pages/HospitalDetail';
import Admin from './pages/Admin';
import Stats from './pages/Stats';
import InscriptionHopital from './pages/InscriptionHopital';
import SuperAdmin from './pages/SuperAdmin';
import LoginHopital from './pages/LoginHopital';
import DashboardHopital from './pages/DashboardHopital';
import Chat from './pages/Chat';
import ServiceDetail from './pages/ServiceDetail';
import RendezVous from './pages/RendezVous';
import MesRendezVous from './pages/MesRendezVous';
import LoginMedecin from './pages/LoginMedecin';
import DashboardMedecin from './pages/DashboardMedecin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hospital/:id" element={<HospitalDetail />} />
        <Route path="/hospital/:hospitalId/service/:serviceName" element={<ServiceDetail />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/inscription-hopital" element={<InscriptionHopital />} />
        <Route path="/super-admin" element={<SuperAdmin />} />
        <Route path="/login-hopital" element={<LoginHopital />} />
        <Route path="/dashboard-hopital" element={<DashboardHopital />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/rendezvous/:hospitalId" element={<RendezVous />} />
        <Route path="/rendezvous" element={<RendezVous />} />
        <Route path="/mes-rendezvous" element={<MesRendezVous />} />
        <Route path="/login-medecin" element={<LoginMedecin />} />
        <Route path="/dashboard-medecin" element={<DashboardMedecin />} />
      </Routes>
    </Router>
  );
}

export default App;