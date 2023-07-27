import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import AgencyIncident from './agency_incident';
import { CardTitleSplit } from '../shared/card_parts';

const typeMap = new Map([
  ['local_police', 'Local Police'],
  ['local_other', 'Local Other'],
  ['sheriff', 'Sheriff'],
  ['other', 'Other'],
  ['state_police', 'State Police'],
  ['state_other', 'State Other'],
  ['federal', 'Federal'],
]);

const Agency = ({ agencyData }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className='agency-card'>
    <Card.Body>
      <Card.Title><CardTitleSplit name={agencyData.agencyname} id={agencyData.agencyid}/></Card.Title>
      <Card.Text className='agency-card-body'>
        <div><b>Total shootings</b>: {agencyData.totalshootings}</div>
        <div><b>State</b>: {agencyData.state}</div>
        <div><b>Agency type</b>: {(agencyData.type) ? typeMap.get(agencyData.type) : agencyData.type}</div>
        <div><b>ORI codes</b>: {(agencyData.oricodes) ? agencyData.oricodes.join(', ') : agencyData.oricodes}</div>
        <div className='agency-incidents'>
          <Button
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            List Incidents
          </Button>
        </div>
        <Collapse in={open}>
          {agencyData.incidentids.length > 0 ? (
            <div>
              <ul>
                {agencyData.incidentids.map((incidentid) => (
                  <li key={incidentid}>
                    <AgencyIncident key={incidentid} incidentid={incidentid}></AgencyIncident>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Collapse>
      </Card.Text>
    </Card.Body>
  </Card>
  );
};

export default Agency;
