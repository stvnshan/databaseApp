import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  return (
    <div>
        <p>ID {incidentData.incidentid}, {(incidentData.name) ? incidentData.name : 'Unknown'}, {(incidentData.date) ? incidentData.date.substring(0, 10) : incidentData.date }</p>
    </div>
  );

};

export default AgencyIncident;