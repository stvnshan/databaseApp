import React, { useState, useEffect } from 'react';
import axios from 'axios';
const apiHost = process.env.REACT_APP_API_HOST;

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchAgencies = async () => {
    try {
      const response = await axios.get(`${apiHost}/agency?searchName=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Washington Post -- Police Shooting Fatalities -- Agencies</h1>

      <div>
        <input
          type="text"
          placeholder="Search Agencies by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={searchAgencies}>Search</button>
      </div>

      <h2>Agencies</h2>
      <div>
      {searchResults.length > 0 ?
        (
          <ul>
            {searchResults.map((agency) => <li key={agency.agencyid}>{agency.agencyid}, {agency.agencyname}</li>)}
          </ul>
        ) : (
          <h3></h3>
        )}      </div>
    </div>
  );
}


export default App;
