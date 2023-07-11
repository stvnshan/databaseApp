import React, { useState, useEffect } from "react";
import axios from "axios";

const apiHost = process.env.REACT_APP_API_HOST;

const Incident = ({incidentid}) => {
  const [incidentData, setIncidentData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;
        if (incidentid) {
          const incidentURL = `${apiHost}/incident?id=${encodeURIComponent(incidentid)}`;
          const response = await axios.get(incidentURL);
          if (response.status !== 200) {
            throw new Error(`Failed to fetch incident ID ` + incidentid);
          }
          result = response.data[0];
          console.log(incidentURL);
        } else {
          result = {
            incidentid : null,
            data : null,
            name : '',
            age : null,
            gender : null,
            race : null,
          }
        }
        // Should return an array with only one element
        setIncidentData(result);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchData();
  }, []);

  console.log(incidentData);

  return (
    <div>
        <p>Incident ID: {incidentData.incidentid}</p>
        <p>Date: {incidentData.date}</p>
        <p>Victim name: {incidentData.name}</p>
        <p>Age: {incidentData.age}</p>
        <p>Gender: {incidentData.gender}</p>
        <p>Race: {incidentData.race}</p>
        <p>State: {incidentData.state}</p>
        <p>County: {incidentData.county}</p>
        <p>Agencies involved: {incidentData.agencynames}</p>
    </div>
  );

};

export default Incident;