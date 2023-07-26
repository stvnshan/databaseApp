import React, { useState } from 'react';
import axios from 'axios';
import TimeLine from './timeLine';
import {SearchField} from '../shared/search';
import MainNav from '../shared/nav';
import PaginationComponent from '../shared/pagination_comp';

const apiHost = String(process.env.REACT_APP_API_HOST);

const AgeSearchForm = ({setSearchResults}) => {
  const [ageSearchQuery, setAgeSearchQuery] = useState('');
  

  const searchAges = async () => {
    try {
      
      const urlStr = apiHost.concat(
        '/incidentAge?',
        (ageSearchQuery.length > 0) ? `age=${encodeURIComponent(ageSearchQuery)}&` : '',
      );
      console.log(urlStr);
      const response = await axios.get(urlStr);
      console.log(response.data);
      setSearchResults(response.data);
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <SearchField
        title={'Age'}
        placeholderText={'20'}
        setSearchQuery={setAgeSearchQuery}
      />

      <button style={{ 'marginLeft': '2rem' }} onClick={searchAges}>
            Search incidents
      </button>
    </div>
  );
};

const AgesResultsList = ({searchResults}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const firstItemIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const lastItemIndex = firstItemIndex + ITEMS_PER_PAGE;
  const displayedIncidents = searchResults.slice(firstItemIndex, lastItemIndex);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <div>

      {/* <p>Total results: {searchResults.length}</p> */}

      {displayedIncidents.length > 0 ? (
        <ul className='list-group list-group-flush'>
          <TimeLine key = {displayedIncidents} mentalIllnessData = {displayedIncidents}></TimeLine>
        </ul>
      ) : (
        <h5>No matching incidents found.</h5>
      )}{' '}

      <PaginationComponent
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={searchResults.length}
        paginate={paginate}
      />

    </div>
  );
}

const TimeLinePage = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <MainNav/>
      <h1>Age search</h1>
      <AgeSearchForm setSearchResults={setSearchResults}/>
      <h2>Results</h2>
      <AgesResultsList searchResults={searchResults}/>
    </div>
  );
};

export default TimeLinePage;
