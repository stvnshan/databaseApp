import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from  './components/home';
import AgencyPage from './components/agency-page/agency_page';
import IncidentPage from './components/incident-page/incident_page';
import IncidentMap from './components/incident_map';


function App() {
   return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/agencies/' element={<AgencyPage />} />
          <Route path='/incidents/' element={<IncidentPage />} />
          <Route path='/map/' element={<IncidentMap />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export default App;
