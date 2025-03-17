import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ParcelsPage from './components/ParcelsPage';
import FungicidesPage from './components/FungicidesPage';
import ProgramPage from './components/ProgramPage';
import Navigation from './components/Navigation';

function App() {
  const [parcels, setParcels] = useState([]);

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<ParcelsPage parcels={parcels} setParcels={setParcels} />} />
          <Route path="/fungicides" element={<FungicidesPage parcels={parcels} setParcels={setParcels} />} />
          <Route path="/program" element={<ProgramPage parcels={parcels} setParcels={setParcels} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
