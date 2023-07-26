import React from 'react';
import MainNav from './shared/nav';
import Map from './map/incident_map';
import BodySection from './shared/body_section';

const AboutBox = () => {
  return (
    <BodySection>
      <hr/>
      <div>
        Welcome to <em>The Washington Post</em> police shooting data project.
        This website is dedicated to providing information regarding police shooting
        fatalities in the United states in an accessible way.
        The data is sourced from <a className='home-link' rel="noopener noreferrer" target="_blank" href='https://github.com/washingtonpost/data-police-shootings/tree/master'><em>The Washington Post</em> Police Shooting Fatalities Data Set</a>.
      </div>
      <hr/>
      <div className='project-footer'>
        <em>CS 348 Databases Spring 2023 Group Project</em>
      </div>
    </BodySection>
  );
}

const Home = () => {
  return (
    <div className='home-body'>
        <MainNav/>
        <Map/>
        <AboutBox/>
    </div>
  );
}

export default Home;
