import React from 'react';

const Incident = ({incidentData}) => {

    console.log(incidentData);

    return (
        <div>
            <h6>Name: {incidentData.name}</h6>
            <p>Age: {incidentData.age}</p>
            <p>Gender: {incidentData.gender}</p>
            <p>Incident ID: {incidentData.incidentid}</p>
            <p>State: {incidentData.state}</p>
            <p>City: {incidentData.cityname}</p>
            <p>County: {incidentData.county}</p>
            <p>Agencies involved: {incidentData.agencynames}</p>
        </div>
    );
}

export default Incident;