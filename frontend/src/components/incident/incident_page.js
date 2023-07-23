import React, { useState } from 'react';
import axios from 'axios';
import Incident from './incident';
import {SearchField} from '../shared/search';
import MainNav from '../shared/nav';

const apiHost = String(process.env.REACT_APP_API_HOST);

const IncidentSearchForm = ({setSearchResults}) => {
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [countySearchQuery, setCountySearchQuery] = useState('');
  const [agencyidSearchQuery, setAgencyidSearchQuery] = useState('');

  const searchAgencies = async () => {
    try {
      const urlStr = apiHost.concat(
        '/incident?',
        (nameSearchQuery.length > 0) ? `victimname=${encodeURIComponent(nameSearchQuery)}&` : '',
        (stateSearchQuery.length > 0) ? `state=${encodeURIComponent(stateSearchQuery)}&` : '',
        (countySearchQuery.length > 0) ? `county=${encodeURIComponent(countySearchQuery)}&` : '',
        (agencyidSearchQuery.length > 0) ? `agencyid=${encodeURIComponent(agencyidSearchQuery)}&` : ''
      );
      console.log(urlStr);
      const response = await axios.get(urlStr);
      setSearchResults(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <SearchField
        title={'Victim name'}
        placeholderText={'Name of victim'}
        setSearchQuery={setNameSearchQuery}
      />
      <SearchField
        title={'State code'}
        placeholderText={'e.g., WA'}
        setSearchQuery={setStateSearchQuery}
      />
      <SearchField
        title={'County'}
        placeholderText={'County'}
        setSearchQuery={setCountySearchQuery}
      />
      <SearchField
        title={'Agency ID'}
        placeholderText={'ID of agency involved'}
        setSearchQuery={setAgencyidSearchQuery}
      />

      <button style={{ 'marginLeft': '2rem' }} onClick={searchAgencies}>
            Search incidents
      </button>
    </div>
  );
};

const IncidentsResultsList = ({searchResults}) => {
  return (
    <div>
      <p>Total results: {searchResults.length}</p>
      {searchResults.length > 0 ? (
        <ul className='list-group list-group-flush'>
          {searchResults.map((incident) => (
            <li key={incident.incidentid} className='list-group-item'>
              <Incident key={incident.incidentid} incidentid={incident.incidentid}></Incident>
            </li>
          ))}
        </ul>
      ) : (
        <h5>No matching incidents found.</h5>
      )}{' '}
    </div>
  );
}

const IncidentPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <MainNav/>
      <h1>Incidents search</h1>
      <IncidentSearchForm setSearchResults={setSearchResults}/>
      <h2>Results</h2>
      <IncidentsResultsList searchResults={searchResults}/>
    </div>
  );
};

export default IncidentPage;
