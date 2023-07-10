import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Agency from "./Agency";
import "bootstrap/dist/css/bootstrap.css";

const apiHost = process.env.REACT_APP_API_HOST;

// Example Agency name: Abilene Police Department

const Search = () => {
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [shootLowSearchQuery, setShootLowSearchQuery] = useState(0);
  const [shootHighSearchQuery, setShootHighSearchQuery] = useState(2147483647);
  const [searchResults, setSearchResults] = useState([]);

  // Called when user clicks Search
  const searchAgenciesByName = async () => {
    try {
      const response = await axios.get(
        `${apiHost}/agency?name=${encodeURIComponent(nameSearchQuery)}`
      );
      setSearchResults(response.data);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const searchAgenciesByNumShoot = async () => {
    try {
      const getURL = `${apiHost}/agency?shootlow=${encodeURIComponent(
        shootLowSearchQuery
      )}&shoothigh=${encodeURIComponent(shootHighSearchQuery)}`;
      console.log(getURL);
      const response = await axios.get(getURL);
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

      <div className="card">
        <h6 class="card-title">Search by Agency Name:</h6>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Agency Name:</span>
          </div>
          <input
            id="inputAgencyName"
            className="form-control"
            type="text"
            placeholder="Search Agencies by name"
            value={nameSearchQuery}
            onChange={(e) => setNameSearchQuery(e.target.value)}
          />
          <button onClick={searchAgenciesByName}>Search</button>
        </div>
      </div>

      <h6>Or</h6>

      <div className="card">
        <h6 className="card-title">Search by number of shootings:</h6>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Min:</span>
          </div>
          <input
            id="inputShootLow"
            type="text"
            placeholder="min. number of shootings"
            value={shootLowSearchQuery}
            onChange={(e) => setShootLowSearchQuery(e.target.value)}
          />

          <div className="input-group-prepend" style={{"margin-left": "2rem"}}>
            <span className="input-group-text">Max:</span>
          </div>
          <input
            id="inputShootHigh"
            type="text"
            placeholder="max. number of shootings"
            value={shootHighSearchQuery}
            onChange={(e) => setShootHighSearchQuery(e.target.value)}
          />

          <button style={{ "margin-left": "2rem" }} onClick={searchAgenciesByNumShoot}>
            Search
          </button>
        </div>
      </div>

      <h2>Agencies</h2>
      <div>
        {searchResults.length > 0 ? (
          <div>
            <p>Total results: {searchResults.length}</p>
            <div className="card" style={{ width: "100%" }}>
              <ul className="list-group list-group-flush">
                {searchResults.map((agency) => (
                  <li key={agency.agencyid} className="list-group-item">
                    <Agency key={agency.agencyid} agencyData={agency}></Agency>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <h3></h3>
        )}{" "}
      </div>
    </div>
  );
};

export default Search;
