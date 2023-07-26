import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from  './components/home';
import AgencyPage from './components/agency/agency_page';
import IncidentPage from './components/incident/incident_page';
import FormPage from './components/form/form_page';
import TimeLinePage from './components/timeLine/timeLine_page';

function App() {
   return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/agencies/' element={<AgencyPage />} />
          <Route path='/incidents/' element={<IncidentPage />} />
          <Route path='/incident_form/' element={<FormPage />} />
          <Route path='/timeLine/' element={<TimeLinePage />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
