import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
        <div>
            Pick the feature you want: 
        </div>
        
        <div>
            <Link to='/agencies'>Search for Agencies</Link>
        </div> 
        <div>
            <Link to='/incidents'>Search for Incidents</Link>
        </div> 
        <div>
            <Link to='/map'>Map of Incidents</Link>
        </div>
       
    </div>
  );
}

export default Home;
