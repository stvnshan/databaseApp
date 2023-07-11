import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

const apiHost = process.env.REACT_APP_API_HOST;
mapboxgl.accessToken = 'pk.eyJ1IjoiZWRvYnJvd28iLCJhIjoiY2xqeWhhdHNrMDQyaTNkb2YyZTdheHJtYSJ9.n1sAsb2dGV9ABpQhHP8qxQ';


const MapContainer = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-97);
  const [lat, setLat] = useState(39);
  const [zoom, setZoom] = useState(3);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  }, []);

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
      <div className="map-container-sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};


const MapView = () => {
  const [incidents, setIncidents] = useState([]);

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
  },[]);

  console.log(JSON.stringify(incidents));

  return (
    <>
    <div>
      <Link to="../">Home</Link>
    </div>
    <MapContainer/>
    </>
  );
}

export default MapView;
