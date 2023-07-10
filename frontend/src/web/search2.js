import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const apiHost = process.env.REACT_APP_API_HOST;

const Search2 = () =>{
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchIncidents = async () => {
    try {
      const response = await axios.get(`${apiHost}/incident?victimname=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
        <div>
            <Link to="../">Home</Link>
      </div>
      <h1>Washington Post -- Police Shooting Fatalities -- Incidents</h1>

      <div>
        <input
          type="text"
          placeholder="Search Incident by Victimname"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={searchIncidents}>Search</button>
      </div>

      <h2>Incidents</h2>
      <div>
      {searchResults.length > 0 ?
        (
          <ul>
          
            {searchResults.map((incident) => <li key={incident.incidentid}>{incident.incidentid}, {incident.name},{incident.cityname}</li>)}
          </ul>
        ) : (
          <h3></h3>
        )}      </div>
    </div>
  );
};


export default Search2;
