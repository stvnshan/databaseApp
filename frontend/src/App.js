import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from  './components/home';
import AgencyPage from './components/agency/agency_page';
import IncidentPage from './components/incident/incident_page';

function App() {
   return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/agencies/' element={<AgencyPage />} />
          <Route path='/incidents/' element={<IncidentPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
