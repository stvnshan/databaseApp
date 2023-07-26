import React, { useState } from 'react';
import axios from 'axios';
import TimeLine from './timeline';
import {SearchField} from '../shared/search';
import MainNav from '../shared/nav';

const apiHost = String(process.env.REACT_APP_API_HOST);

const AgeSearchForm = ({setSearchResults}) => {
  const [ageSearchQuery, setAgeSearchQuery] = useState('');
  

  const searchAges = async () => {
    try {
      const urlStr = apiHost.concat(
        '/incidentAge?',
        (ageSearchQuery.length > 0 && !isNaN(ageSearchQuery)) ? `age=${encodeURIComponent(ageSearchQuery)}&` : 'age=20',
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
  const [currentPage, ] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const firstItemIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const lastItemIndex = firstItemIndex + ITEMS_PER_PAGE;
  const displayedIncidents = searchResults.slice(firstItemIndex, lastItemIndex);

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
    </div>
  );
}

const TimelinePage = () => {
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

export default TimelinePage;
