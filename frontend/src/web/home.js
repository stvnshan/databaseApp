import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
        <div>
            Pick the feature you want: 
        </div>
        
        <div>
            <Link to="/question">Search for Agencies</Link>
        </div> 
        <div>
            <Link to="/question2">Search for Incidents</Link>
        </div> 
        
       
    </div>
  );
}

export default Home;