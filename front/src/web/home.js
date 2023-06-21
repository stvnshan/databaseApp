import React from 'react';
import { Link } from 'react-router-dom';

function home() {
  return (
    <div>
        <div>
            Pick the feature you want: 
        </div>
        
        <div>
            <Link to="/question/search">Search for Shootings</Link>
        </div> 
    </div>
  );
}

export default home;