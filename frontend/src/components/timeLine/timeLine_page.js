import React, { useState } from 'react';
import axios from 'axios';
import TimeLine from './timeLine';
import {NumberField} from '../shared/search';
import MainNav from '../shared/nav';
import BodySection from '../shared/body_section';

const apiHost = String(process.env.REACT_APP_API_HOST);

const AgeSearchForm = ({setSearchResults}) => {
  const [ageSearchQuery, setAgeSearchQuery] = useState('');
  

  const searchAges = async () => {
    try {
      const urlStr = apiHost.concat(
        '/incidentAge?',
        (ageSearchQuery && !isNaN(ageSearchQuery)) ? `age=${encodeURIComponent(ageSearchQuery)}&` : 'age=20',
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
      <NumberField
        title={'Age'}
        placeholderText={'20'}
        setSearchQuery={setAgeSearchQuery}
      />

      <button onClick={searchAges}>
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
      <h2>Results</h2>
      {displayedIncidents.length > 0 ? (
        <ul className='list-group list-group-flush'>
          <TimeLine key = {displayedIncidents} mentalIllnessData = {displayedIncidents}></TimeLine>
        </ul>
      ) : (
        <p>No matching incidents found.</p>
      )}{' '}
    </div>
  );
}

const TimelinePage = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <div>
      <MainNav/>
      <BodySection>
        <h1>Timeline</h1>
        <hr/>
        <AgeSearchForm setSearchResults={setSearchResults}/>
        <hr/>
        <AgesResultsList searchResults={searchResults}/>
      </BodySection>
    </div>
  );
};

export default TimelinePage;
