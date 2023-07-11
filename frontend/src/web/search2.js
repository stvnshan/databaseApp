import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Incident from './Incident';

const apiHost = process.env.REACT_APP_API_HOST;

const Search2 = () => {
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [stateSearchQuery, setStateSearchQuery] = useState("");
  const [countySearchQuery, setCountySearchQuery] = useState("");
  const [agencyidSearchQuery, setAgencyidSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchIncidentsByName = async () => {
    try {
      const response = await axios.get(
        `${apiHost}/incident?victimname=${encodeURIComponent(nameSearchQuery)}`
      );
      setSearchResults(response.data);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const searchIncidentsByState = async () => {
    try {
      const response = await axios.get(
        `${apiHost}/incident?state=${encodeURIComponent(stateSearchQuery)}`
      );
      console.log(`${apiHost}/incident?state=${encodeURIComponent(stateSearchQuery)}`);
      setSearchResults(response.data);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const searchIncidentsByCounty = async () => {
    try {
      const response = await axios.get(
        `${apiHost}/incident?county=${encodeURIComponent(countySearchQuery)}`
      );
      console.log(`${apiHost}/incident?county=${encodeURIComponent(countySearchQuery)}`);
      setSearchResults(response.data);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  const searchIncidentsByAgencyid = async () => {
    try {
      const response = await axios.get(
        `${apiHost}/incident?agencyid=${encodeURIComponent(agencyidSearchQuery)}`
      );
      console.log(`${apiHost}/incident?state=${encodeURIComponent(agencyidSearchQuery)}`);
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

      <h2>Incidents</h2>

      <div className="card">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Victim Name:</span>
          </div>
          <input
            id="inputVictimName"
            className="form-control"
            type="text"
            placeholder="Search Incidents by victim name"
            value={nameSearchQuery}
            onChange={(e) => setNameSearchQuery(e.target.value)}
          />
          <button onClick={searchIncidentsByName}>Search</button>
        </div>
      </div>

      <div className="card">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">State:</span>
          </div>
          <input
            id="inputState"
            className="form-control"
            type="text"
            placeholder="Search Incidents by state"
            value={stateSearchQuery}
            onChange={(e) => setStateSearchQuery(e.target.value)}
          />
          <button onClick={searchIncidentsByState}>Search</button>
        </div>
      </div>

      <div className="card">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">County:</span>
          </div>
          <input
            id="inputCounty"
            className="form-control"
            type="text"
            placeholder="Search Incidents by county"
            value={countySearchQuery}
            onChange={(e) => setCountySearchQuery(e.target.value)}
          />
          <button onClick={searchIncidentsByCounty}>Search</button>
        </div>
      </div>

      <div className="card">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">Agency ID:</span>
          </div>
          <input
            id="inputAgencyid"
            className="form-control"
            type="text"
            placeholder="Search Incidents by Agency ID"
            value={agencyidSearchQuery}
            onChange={(e) => setAgencyidSearchQuery(e.target.value)}
          />
          <button onClick={searchIncidentsByAgencyid}>Search</button>
        </div>
      </div>

      <div>
        <p>Total results: {searchResults.length}</p>
        {searchResults.length > 0 ? (
          <ul className="list-group list-group-flush">
            {searchResults.map((incident) => (
              <li key={incident.incidentid} className="list-group-item">
                <Incident key={incident.incidentid} incidentid={incident.incidentid}></Incident>
              </li>
            ))}
          </ul>
        ) : (
          <h3></h3>
        )}{" "}
      </div>

    </div>
  );
};

export default Search2;
