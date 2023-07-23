import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import '../index.css';

const apiHost = process.env.REACT_APP_API_HOST;
mapboxgl.accessToken = 'pk.eyJ1IjoiZWRvYnJvd28iLCJhIjoiY2xqeWhhdHNrMDQyaTNkb2YyZTdheHJtYSJ9.n1sAsb2dGV9ABpQhHP8qxQ';


const MapContainer = () => {
  const [incidents, setIncidents] = useState([]);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-97);
  const [lat, setLat] = useState(39);
  const [zoom, setZoom] = useState(3);

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
      center: [lng, lat],
      zoom: zoom
    });
  }, []);

  useEffect(() => {
    if (!incidents.length || !map.current) return;
    
    incidents.map((incident) =>
      new mapboxgl.Marker().setLngLat([incident.longitude, incident.latitude]).addTo(map.current)
    );
  }, [incidents]);


  // Update top bar
  useEffect(() => {
    if (!map.current) return;
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  return (
    <div>
      <div ref={mapContainer} className='map-container' />
      <div className='map-container-topbar'>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
    </div>
  );
};


export default MapContainer;
