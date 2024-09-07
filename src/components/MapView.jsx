import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Spinner from "./Spinner";

const defaultZoom = 15;

const MapView = ({
  centerCoordinates,
  markers = []
}) => {
  const [loading, setLoading] = useState(true);
  const [centerCoords, setCenterCoords] = useState([0, 0]);

  useEffect(() => {
    setCenterCoords(centerCoordinates);
    setLoading(false);
  }, []);

  /*
  useEffect(() => {
    geocodeAddress(center).then((coordinates) => {
      console.log(coordinates);
      setCenterCoordinates([coordinates.longitude, coordinates.latitude]);
  });
  }, []);
  

  const markers = [
      {
          position: [48.8566, 2.3522],
          content: "Paris",
          popUp: "Pop up content to show"
      },
      {
          position: [40.7128, -74.0060],
          content: "New York",
          popUp: "Pop up content"
      },
      {
          position: [51.5074, -0.1278],
          content: "London",
          popUp: "Pop up content"
      }
  ];

  */

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
      center={centerCoords}
      zoom={defaultZoom}
      style={{ height: "250px", width: "100%" }}
      >
          <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

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
    )};
    </div>
  );
};

export default MapView;