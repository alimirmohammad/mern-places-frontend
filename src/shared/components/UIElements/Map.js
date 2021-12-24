import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import './Map.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export default function Map({ className, style, center, zoom }) {
  const mapRef = useRef();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [center.lng, center.lat],
      zoom,
    });
    new mapboxgl.Marker().setLngLat([center.lng, center.lat]).addTo(map);
  }, [center, zoom]);

  return <div ref={mapRef} className={`map ${className}`} style={style} />;
}
