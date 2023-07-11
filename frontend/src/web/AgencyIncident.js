import React, { useState, useEffect } from "react";
import axios from "axios";

const apiHost = process.env.REACT_APP_API_HOST;

const AgencyIncident = ({incidentid}) => {
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
          // Should return an array with only one element
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
    </div>
  );

};

export default AgencyIncident;