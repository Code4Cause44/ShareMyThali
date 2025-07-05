import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../DonateFood.css';

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

const redIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [40, 40], 
  iconAnchor: [20, 40],
  popupAnchor: [0, -35]
});

function MapComponent({ address }) {
  const [coordinates, setCoordinates] = useState([28.6139, 77.2090]); 
  const [foundLocation, setFoundLocation] = useState('');

  useEffect(() => {
    if (!address) return;

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setCoordinates([lat, lon]);
          setFoundLocation(data[0].display_name);
        } else {
          setFoundLocation('Address not found');
        }
      } catch (error) {
        setFoundLocation('Error fetching coordinates');
        console.error(error);
      }
    };

    fetchCoordinates();
  }, [address]);

  return (
    <div className="map-section">
      <MapContainer center={coordinates} zoom={13} scrollWheelZoom={false} className="leaflet-container">
        <ChangeView center={coordinates} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates} icon={redIcon}>
          <Popup>
            📍 Pickup Location<br />
            {foundLocation || 'Locating...'}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapComponent;
