import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

const customIcon = new L.Icon({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LocationPicker({ initialPostion, onSelect }) {
  const [position, setPosition] = React.useState(initialPostion || null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
    },
  });

  return position ? (
    <Marker position={position} draggable={true} icon={customIcon} />
  ) : null;
}

const MapSelector = ({ location, onLocationSelect }) => (

  <MapContainer
    className="h-[250px] w-[800px] mb-8 rounded-[21px]"
    center={[location.lat, location.lon]}
    zoom={13}
  >
    <TileLayer
      attribution='&copy; OpenStreetMap contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <LocationPicker initialPostion={location} onSelect={onLocationSelect} />
  </MapContainer>
);

export default MapSelector;
