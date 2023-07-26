import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from  './components/home';
import AgencyPage from './components/agency/agency_page';
import IncidentPage from './components/incident/incident_page';
import FormPage from './components/form/form_page';
import TimelinePage from './components/timeline/timeline_page';
import BodyCamPage from './components/bodycam/bodycaminfo_page';

function App() {
   return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/incidents/' element={<IncidentPage />} />
          <Route path='/agencies/' element={<AgencyPage />} />
          <Route path='/timeline/' element={<TimelinePage />} />
          <Route path='/bodycam/' element={<BodyCamPage />} />
          <Route path='/report/' element={<FormPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
