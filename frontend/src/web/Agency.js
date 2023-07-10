import React from 'react';

/*
interface agencyData {
    agencyid: int;
    agencyname: string;
    incidentids: int[];
    oricodes: string[];
    state: string;
    totalshootings: int;
    type: string;
}
*/

const Agency = ({agencyData}) => {

    return (
        <div>
            <h2>{agencyData.agencyname}</h2>
            <p>ID: {agencyData.agencyid}</p>
            <p>State: {agencyData.state}</p>
            <p>Oricodes: {agencyData.oricodes}</p>
            <p>Agency type: {agencyData.type}</p>
            <p>Total shootings: {agencyData.totalshootings}</p>
        </div>
    );

}

export default Agency;