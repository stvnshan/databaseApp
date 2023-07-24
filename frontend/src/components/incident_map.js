import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import '../index.css';

const apiHost = process.env.REACT_APP_API_HOST;
mapboxgl.accessToken = 'pk.eyJ1IjoiZWRvYnJvd28iLCJhIjoiY2xqeWhhdHNrMDQyaTNkb2YyZTdheHJtYSJ9.n1sAsb2dGV9ABpQhHP8qxQ';

const initLng = -97;
const initLat = 39;
const initZoom = 4;

const Map = () => {
  const [incidents, setIncidents] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    const retrieveIncidents = async() => {
      try {
        const response = await axios.get(`${apiHost}/incidentbrief`);
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

    console.log(incidents[0]);

    for (let i = 0; i < incidents.length && i < 250; ++i) {
      const el = document.createElement('div');
      el.className = 'marker';
      const popup = new mapboxgl.Popup({ offset: 10 }).setText(`${incidents[i].name}`);
      new mapboxgl.Marker(el).setLngLat([incidents[i].longitude, incidents[i].latitude]).setPopup(popup).addTo(map.current);
    }
  });

  return (
    <div>
      <div ref={mapContainer} className='map-container' />
    </div>
  );
};

export default Map;
