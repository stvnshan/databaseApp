import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import '../index.css';

const apiHost = process.env.REACT_APP_API_HOST;
mapboxgl.accessToken = 'pk.eyJ1IjoiZWRvYnJvd28iLCJhIjoiY2xqeWhhdHNrMDQyaTNkb2YyZTdheHJtYSJ9.n1sAsb2dGV9ABpQhHP8qxQ';

const initLng = -97;
const initLat = 39;
const initZoom = 3;

const Map = () => {
  const [incidents, setIncidents] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Retrieve all incidents
  useEffect(() => {
    const retrieveIncidents = async() => {
      try {
        const response = await axios.get(`${apiHost}/incident`);
        setIncidents(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    retrieveIncidents();

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [initLng, initLat],
      zoom: initZoom, 
    });
  }, []);

  useEffect(() => {
    if (!incidents.length || !map.current) return;
    
    incidents.map((incident) =>
      new mapboxgl.Marker().setLngLat([incident.longitude, incident.latitude]).addTo(map.current)
    );
  }, [incidents]);

  return (
    <div>
      <div ref={mapContainer} className='map-container' />
    </div>
  );
};

export default Map;
