import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import SessionJourney from './pages/SessionJourney';
import Heatmap from './pages/Heatmap';

function App() {
  const [lastUpdated, setLastUpdated] = useState(null);

  const handleRefresh = () => {
    setLastUpdated(new Date().toLocaleTimeString());
    window.location.reload();
  };

  return (
    <Router>
      <Layout onRefresh={handleRefresh} lastUpdated={lastUpdated}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/sessions/:sessionId" element={<SessionJourney />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
