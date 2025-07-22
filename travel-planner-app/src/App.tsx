import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.scss';
import Home from './pages/Home';
import CreateTrip from './pages/CreateTrip';
import TravelPlan from './pages/TravelPlan';
import { TripProvider } from './contexts/TripContext';

const App: React.FC = () => {
  return (
    <TripProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateTrip />} />
          <Route path="/trip/:id" element={<TravelPlan />} />
        </Routes>
      </Router>
    </TripProvider>
  );
};

export default App;
