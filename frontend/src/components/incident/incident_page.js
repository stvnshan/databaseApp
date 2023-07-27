import React, { useState } from 'react';
import axios from 'axios';
import Incident from './incident';
import {SearchField, NumberField, SearchDropdownField, ResultTitle} from '../shared/search';
import MainNav from '../shared/nav';
import PaginationComponent from '../shared/pagination_comp';
import BodySection from '../shared/body_section';

const apiHost = String(process.env.REACT_APP_API_HOST);

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN',
  'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV',
  'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN',
  'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
];

const IncidentSearchForm = ({setSearchResults}) => {
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [stateSearchQuery, setStateSearchQuery] = useState('');
  const [countySearchQuery, setCountySearchQuery] = useState('');
  const [agencyNameSearchQuery, setAgencyNameSearchQuery] = useState('');
  const [agencyidSearchQuery, setAgencyidSearchQuery] = useState('');

  const searchAgencies = async () => {
    try {
      const urlStr = apiHost.concat(
        '/incident?',
        (nameSearchQuery) ? `victimname=${encodeURIComponent(nameSearchQuery)}&` : '',
        (stateSearchQuery) ? `state=${encodeURIComponent(stateSearchQuery)}&` : '',
        (countySearchQuery) ? `county=${encodeURIComponent(countySearchQuery)}&` : '',
        (agencyNameSearchQuery) ? `agencyname=${encodeURIComponent(agencyNameSearchQuery)}&` : '',
        (agencyidSearchQuery && !isNaN(agencyidSearchQuery)) ? `agencyid=${encodeURIComponent(agencyidSearchQuery)}&` : ''
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
      <SearchDropdownField
        title={"State"} 
        options={states}
        selectedOption={stateSearchQuery}
        handleOptionChange={setStateSearchQuery}
      />
      <SearchField
        title={'County'}
        placeholderText={'County'}
        setSearchQuery={setCountySearchQuery}
      />
      <SearchField
        title={'Agency name'}
        placeholderText={'Agency name'}
        setSearchQuery={setAgencyNameSearchQuery}
      />
      <NumberField
        title={'Agency ID'}
        placeholderText={'ID of agency involved'}
        setSearchQuery={setAgencyidSearchQuery}
      />

      <button onClick={searchAgencies}>
            Search incidents
      </button>
    </div>
  );
};

const IncidentsResultsList = ({searchResults}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const firstItemIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const lastItemIndex = firstItemIndex + ITEMS_PER_PAGE;
  const displayedIncidents = searchResults.slice(firstItemIndex, lastItemIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <ResultTitle count={searchResults.length}/>
      <hr/>
      <PaginationComponent
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={searchResults.length}
        paginate={paginate}
      />
      {displayedIncidents.length > 0 ? (
        <ul className='list-group list-group-flush'>
          {displayedIncidents.map((incident) => (
            <li key={incident.incidentid} className='list-group-item'>
              <Incident key={incident.incidentid} incidentid={incident.incidentid}></Incident>
            </li>
          ))}
        </ul>
      ) : (
        <p>No matching incidents found.</p>
      )}{' '}
    </div>
  );
}

const IncidentPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <MainNav/>
      <BodySection>
        <h1>Incidents search</h1>
        <hr/>
        <IncidentSearchForm setSearchResults={setSearchResults}/>
        <hr/>
        <IncidentsResultsList searchResults={searchResults}/>
      </BodySection>
    </div>
  );
};

export default IncidentPage;
