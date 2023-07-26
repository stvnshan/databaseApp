import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiHost = process.env.REACT_APP_API_HOST;

const AgencyBodyCamInfo = () => {
    const [agencyId, setAgencyId] = useState('');
    const [bodyCamPercentage, setBodyCamPercentage] = useState(null);

    const fetchBodyCamInfo = async () => {
        try {
            const response = await axios.get(`${apiHost}/bodyCamPercentage?agencyId=${encodeURIComponent(agencyId)}`);
            setBodyCamPercentage(response.data.bodyCamPercentage);
        } catch (error) {
            console.error('Failed to fetch body cam info:', error);
            // Optionally handle error on UI, maybe with a message to user
        }
    };

    useEffect(() => {
        if (agencyId) {
            fetchBodyCamInfo();
        }
    }, [agencyId]);

    return (
        <div>
            <input
                type="text"
                placeholder="Enter agency ID"
                value={agencyId}
                onChange={(e) => setAgencyId(e.target.value)}
            />
            <button onClick={fetchBodyCamInfo}>Get Body Cam Percentage</button>

            {bodyCamPercentage !== null && (
                <p>
                    Body camera usage for this agency is: <strong>{bodyCamPercentage.toFixed(2)}%</strong>
                </p>
            )}
        </div>
    );
};

export default AgencyBodyCamInfo;
