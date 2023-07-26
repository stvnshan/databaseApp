import React, { useState } from 'react';
import axios from 'axios';
import {NumberField} from '../shared/search';
import MainNav from '../shared/nav';
import BodySection from '../shared/body_section';

const apiHost = String(process.env.REACT_APP_API_HOST);

const BodyCamSearchForm = ({ setBodyCamPercentage }) => {
  const [agencyIdSearchQuery, setAgencyIdSearchQuery] = useState('');
  const [invalidAgencyProvided, setInvalidAgencyProvided] = useState(false);
  const [, setSubmittedPOST] = useState(false);

  const validateAgencyID = async () => {
    // Check if Agency exists
    try {
      const urlStr = apiHost.concat(
        `/agencybrief?id=${encodeURIComponent((agencyIdSearchQuery) ? agencyIdSearchQuery : '-1')}`
      );
      console.log(urlStr);
      const response = await axios.get(urlStr);

      if (response.data.length === 0) {
        setInvalidAgencyProvided(true);
        setSubmittedPOST(false);
        return false;
      }
    } catch (err) {
      console.error(err);
      setInvalidAgencyProvided(true);
      setSubmittedPOST(false);
      return false;
    }
    return true;
  }

  const fetchBodyCamPercentage = async () => {
    const validAgency = await validateAgencyID();
    console.log(validAgency);
    if (!validAgency) return;

    setInvalidAgencyProvided(false);

    try {
      const urlStr = apiHost.concat(
        '/bodycamPercentage?',
        (agencyIdSearchQuery && !isNaN(agencyIdSearchQuery)) ? `id=${encodeURIComponent(agencyIdSearchQuery)}&` : '',
      );
      console.log(urlStr);
      const response = await axios.get(urlStr);
      setBodyCamPercentage(response.data.bodyCamPercentage);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <NumberField
        title={'Agency ID'}
        placeholderText={'70'}
        setSearchQuery={setAgencyIdSearchQuery}
      />

      {invalidAgencyProvided ? <p style={{color: 'red'}}>Error: Agency ID provided does not exist.</p> : null}

      <button onClick={fetchBodyCamPercentage}>
            Fetch Body Cam Info
      </button>
    </div>
  );
};

const BodyCamInfoPage = () => {
  const [bodyCamPercentage, setBodyCamPercentage] = useState(null);

  return (
    <div>
      <MainNav />
      <BodySection>
        <h1>Body Cam Information Search</h1>
        <hr/>
        <BodyCamSearchForm setBodyCamPercentage={setBodyCamPercentage} />
        <hr/>
        <h2>Result</h2>
        {bodyCamPercentage !== null ? (
          <h5>Body Camera Usage Percentage: {bodyCamPercentage}%</h5>
        ) : (
          <p>Please enter an agency ID to view the body cam usage percentage.</p>
        )}
      </BodySection>
    </div>
  );
};

export default BodyCamInfoPage;
