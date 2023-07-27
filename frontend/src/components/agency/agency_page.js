import React, { useState } from 'react';
import axios from 'axios';
import Agency from './agency';
import {SearchField, SearchRangeField, ResultTitle, NumberField, SearchDropdownField} from '../shared/search';
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

const AgencySearchForm = ({setSearchResults}) => {
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [agencyidSearchQuery, setAgencyidSearchQuery] = useState('');
  const [shootLowSearchQuery, setShootLowSearchQuery] = useState('');
  const [shootHighSearchQuery, setShootHighSearchQuery] = useState('');
  const [stateSearchQuery, setStateSearchQuery] = useState('');

  const searchAgencies = async () => {
    try {
      const urlStr = apiHost.concat(
        '/agency?',
        (nameSearchQuery) ? `name=${encodeURIComponent(nameSearchQuery)}&` : '',
        (agencyidSearchQuery && !isNaN(agencyidSearchQuery)) ? `id=${encodeURIComponent(agencyidSearchQuery)}&` : '',
        (shootLowSearchQuery) ? `shootlow=${encodeURIComponent(shootLowSearchQuery)}&` : '',
        (shootHighSearchQuery) ? `shoothigh=${encodeURIComponent(shootHighSearchQuery)}&` : '',
        (stateSearchQuery) ? `state=${encodeURIComponent(stateSearchQuery)}&` : '',
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
        title={'Agency name'}
        placeholderText={'Search Agencies by name'}
        setSearchQuery={setNameSearchQuery}
      />
      <NumberField
        title={'Agency ID'}
        placeholderText={'ID of agency involved'}
        setSearchQuery={setAgencyidSearchQuery}
      />
      <SearchRangeField
        title={'Number of shootings'}
        low={{placeholderText: 'From', searchQuery: shootLowSearchQuery, setSearchQuery: setShootLowSearchQuery}}
        high={{placeholderText: 'To', searchQuery: shootHighSearchQuery, setSearchQuery: setShootHighSearchQuery}}
      />
      <SearchDropdownField
        title={"State"} 
        options={states}
        selectedOption={stateSearchQuery}
        handleOptionChange={setStateSearchQuery}
      />

      <button onClick={searchAgencies}>
            Search agencies
      </button>
    </div>
  );
};

const AgencyResultsList = ({searchResults}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const firstItemIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const lastItemIndex = firstItemIndex + ITEMS_PER_PAGE;
  const displayedAgencies = searchResults.slice(firstItemIndex, lastItemIndex);

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
      {searchResults.length > 0 ? (
        <div>
            {displayedAgencies.map((agency) => (
              <Agency key={agency.agencyid} agencyData={agency}></Agency>
            ))}
        </div>
      ) : (
        <p>No matching agencies found.</p>
      )}{' '}
    </div>
  );
};

const AgencyPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <MainNav/>
      <BodySection>
        <h1>Agencies database</h1>
        <hr/>
        <AgencySearchForm setSearchResults={setSearchResults}/>
        <hr/>
        <AgencyResultsList searchResults={searchResults}/>
      </BodySection>
    </div>
  );
};

export default AgencyPage;
