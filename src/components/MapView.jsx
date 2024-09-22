import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Spinner from "./Spinner";

const defaultZoom = 13;
const defaultCoordinates = [-34.5814551, -58.4211107];

const MapView = ({
  centerCoordinates = defaultCoordinates,
  markers = [],
  zoom = defaultZoom,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const MapUpdater = ({ centerCoordinates }) => {
    const map = useMap();
    useEffect(() => {
      if (centerCoordinates) {
        map.setView(centerCoordinates, map.getZoom());
      }
    }, [centerCoordinates, map]);
    return null;
  };

  const customIcon = new Icon({
      iconUrl: "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
      iconSize: [40,40]
  });

  return (
    <div>
    {loading ? (
      <Spinner />
    ) : (
      <MapContainer
      center={centerCoordinates}
      zoom={zoom}
      style={{ height: "250px", width: "100%" }}
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
    )}
    </div>
  );
};

export default MapView;