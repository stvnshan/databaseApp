import React from 'react';
import MainNav from './shared/nav';
import MapContainer from './incident_map';

const Home = () => {
  return (
    <div>
        <MainNav/>
        <MapContainer/>
    </div>
  );
}

export default Home;
