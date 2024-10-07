import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import Spinner from "./Spinner";
import axios from 'axios';

const fetchRoute = async (start, end) => {
  const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`);
  return response.data.routes[0].geometry.coordinates;
};


const defaultZoom = 13;
const defaultCoordinates = [-34.5814551, -58.4211107];

const styles = {
  map: {
    height: "400px",
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    margin: "20px 0",
  },
};

const MapWithRouteView = ({
  centerCoordinates = defaultCoordinates,
  markers = [],
  zoom = defaultZoom,
  routeCoordinates = [],
}) => {
  const [loading, setLoading] = useState(true);
  const [routeCoords, setRouteCoords] = useState(routeCoordinates);

  useEffect(() => {
    const fetchAllRoutes = async () => {
      const allRoutes = [];
      for (let i = 0; i < routeCoordinates.length - 1; i++) {
        const route = await fetchRoute(routeCoordinates[i], routeCoordinates[i + 1]);
        const convertedRoute = route.map(coord => [coord[1], coord[0]]);
        allRoutes.push(convertedRoute);
      }
      setRouteCoords(allRoutes);
      setLoading(false);
    };

    fetchAllRoutes();
  }, [routeCoordinates]);

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
      style={styles.map}
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

          {routeCoords.map((route, index) => (
            <Polyline key={index} pathOptions={{ color: 'blue' }} positions={route} />
          ))}

      </MapContainer>
    )}
    </div>
  );
};

export default MapWithRouteView;