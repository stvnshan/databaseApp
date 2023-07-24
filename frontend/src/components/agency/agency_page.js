import React, { useState } from 'react';
import axios from 'axios';
import Agency from './agency';
import {SearchField, SearchRangeField} from '../shared/search';
import MainNav from '../shared/nav';
import PaginationComponent from '../shared/pagination_comp';

const apiHost = String(process.env.REACT_APP_API_HOST);

const AgencySearchForm = ({setSearchResults}) => {
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [shootLowSearchQuery, setShootLowSearchQuery] = useState('');
  const [shootHighSearchQuery, setShootHighSearchQuery] = useState('');

  const searchAgencies = async () => {
    try {
      const urlStr = apiHost.concat(
        '/agency?',
        (nameSearchQuery.length > 0) ? `name=${encodeURIComponent(nameSearchQuery)}&` : '',
        (shootLowSearchQuery.length > 0) ? `shootlow=${encodeURIComponent(shootLowSearchQuery)}&` : '',
        (shootHighSearchQuery.length > 0) ? `shoothigh=${encodeURIComponent(shootHighSearchQuery)}&` : ''
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
      <SearchRangeField
        title={'Number of shootings'}
        low={{placeholderText: 'From', searchQuery: shootLowSearchQuery, setSearchQuery: setShootLowSearchQuery}}
        high={{placeholderText: 'To', searchQuery: shootHighSearchQuery, setSearchQuery: setShootHighSearchQuery}}
      />

      <button style={{ 'marginLeft': '2rem' }} onClick={searchAgencies}>
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
      {searchResults.length > 0 ? (
        <div>
          <p>Total results: {searchResults.length}</p>
          <div className='card' style={{ width: '100%' }}>
            <ul className='list-group list-group-flush'>
              {displayedAgencies.map((agency) => (
                <li key={agency.agencyid} className='list-group-item'>
                  <Agency key={agency.agencyid} agencyData={agency}></Agency>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <h5>No matching agencies found.</h5>
      )}{' '}

      <PaginationComponent
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={searchResults.length}
        paginate={paginate}
      />

    </div>
  );
};

const AgencyPage = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <MainNav/>
      <h1>Agencies database</h1>
      <AgencySearchForm setSearchResults={setSearchResults}/>
      <h2>Results</h2>
      <AgencyResultsList searchResults={searchResults}/>
    </div>
  );
};

export default AgencyPage;
