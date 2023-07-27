import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { CardTitleSplit } from '../shared/card_parts';

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

  return (
    <Card className='incident-card'>
      <Card.Body>
        <Card.Title><CardTitleSplit name={(incidentData.name) ? incidentData.name : 'Unknown'} id={incidentData.incidentid}/></Card.Title>
        <Card.Text className='incident-card-body'>
          <div><b>Age</b>: {incidentData.age}</div>
          <div><b>Gender</b>: {incidentData.gender}</div>
          <div><b>Race</b>: {incidentData.race}</div>
          <div><b>Setting</b>: {`${incidentData.cityname}, ${incidentData.county}, ${incidentData.state}, ${(incidentData.date) ? incidentData.date.substring(0, 10) : incidentData.date}`}</div>
          <div><b>Agencies</b>: {incidentData.agencynames}</div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Incident;