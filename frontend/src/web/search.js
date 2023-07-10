import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Agency from "./Agency";

const apiHost = process.env.REACT_APP_API_HOST;

// Example Agency name: Abilene Police Department

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Called when user clicks Search
  const searchAgencies = async () => {
    try {
      const response = await axios.get(
        `${apiHost}/agency?name=${encodeURIComponent(searchQuery)}`
      );
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
        {searchResults.length > 0 ? (
          <div>
            <p>Total results: {searchResults.length}</p>
            {searchResults.map((agency) => (
              <Agency key={agency.agencyid} agencyData={agency}></Agency>
            ))}
          </div>
        ) : (
          <h3></h3>
        )}{" "}
      </div>
    </div>
  );
};

export default Search;
