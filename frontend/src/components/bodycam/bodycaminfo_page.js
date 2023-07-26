import React, { useState } from 'react';
import axios from 'axios';
import {SearchField} from '../shared/search';
import MainNav from '../shared/nav';

const apiHost = String(process.env.REACT_APP_API_HOST);

const BodyCamSearchForm = ({ setBodyCamPercentage }) => {
  const [agencyIdSearchQuery, setAgencyIdSearchQuery] = useState('');

  const fetchBodyCamPercentage = async () => {
    console.log("Agency ID Search Query:", agencyIdSearchQuery);
    try {

      const urlStr = apiHost.concat(
        '/bodycamPercentage?',
        (agencyIdSearchQuery.length > 0) ? `id=${encodeURIComponent(agencyIdSearchQuery)}&` : '',
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
      <SearchField
        title={'Agency ID'}
        placeholderText={'70'}
        setSearchQuery={setAgencyIdSearchQuery}
      />

      <button style={{ 'marginLeft': '2rem' }} onClick={fetchBodyCamPercentage}>
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
      <h1>Body Cam Information Search</h1>
      <BodyCamSearchForm setBodyCamPercentage={setBodyCamPercentage} />
      <h2>Result</h2>
      {bodyCamPercentage !== null ? (
        <p>Body Camera Usage Percentage: {bodyCamPercentage}%</p>
      ) : (
        <p>Please enter an agency ID to view the body cam usage percentage.</p>
      )}
    </div>
  );
};

export default BodyCamInfoPage;
