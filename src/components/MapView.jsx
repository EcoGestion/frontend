import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Spinner from "./Spinner";

const defaultZoom = 13;
const defaultCoordinates = [-34.5814551, -58.4211107];

const styles = {
  map: {
    height: "450px",
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    margin: "20px 0",
  },
};

const MapUpdater = ({ centerCoordinates, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(centerCoordinates, zoom);
  }, [centerCoordinates, zoom, map]);

  return null;
};

const MapView = ({
  centerCoordinates,
  markers = [],
  zoom = defaultZoom,
}) => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    setLoading(false);
  }, [centerCoordinates, zoom, markers]);

  const customIcon = new Icon({
      iconUrl: "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
      iconSize: [40,40]
  });

  if (!window) {
    return <Spinner />;
  }
  else {return (
    <MapContainer
    center={centerCoordinates}
    zoom={zoom}
    style={styles.map}
    >
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater centerCoordinates={centerCoordinates} zoom={zoom} />
        {markers.map((marker) => (
        <Marker position={marker.position} icon={customIcon }>
            <Popup>
                <div>
                    <h2>{marker.content}</h2>
                    <p>{marker.popUp}</p>
                </div> 
            </Popup>
        </Marker>
        ))}
    </MapContainer>
    );
  }
};

export default MapView;