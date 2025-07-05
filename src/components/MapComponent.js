import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../DonateFood.css';

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

function MapComponent() {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState([28.6139, 77.2090]);

  const handleSearch = async () => {
    if (!location) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        alert('Location not found.');
      }
    } catch (error) {
      alert('Error fetching location.');
    }
  };

  return (
    <div className="map-section">
      <h2>Find Pickup Location</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '10px',
            width: '60%',
            marginRight: '10px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            backgroundColor: '#e63946',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Locate
        </button>
      </div>

      <MapContainer center={coordinates} zoom={13} scrollWheelZoom={false} className="leaflet-container">
        <ChangeView center={coordinates} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            Selected Location<br />{location || "Default Location"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapComponent;
