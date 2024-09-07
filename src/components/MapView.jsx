import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import geocodeAddress from "@utils/geocodeAddress";
import "leaflet/dist/leaflet.css";

const MapView = () => {
  const [mockCoordinates, setMockCoordinates] = useState([-34.5950078, -58.3732943]);

  const mockAddress = {
      street: "Santa Fe",
      number: "2433",
      city: "Ciudad Autonoma de Buenos Aires",
      state: "Ciudad Autonoma de Buenos Aires",
      zip: "C1123AAG",
      country: "Argentina"
  };

    useEffect(() => {
      geocodeAddress(mockAddress).then((coordinates) => {
        console.log(coordinates);
        setMockCoordinates([coordinates.longitude, coordinates.latitude]);
    });
    }, []);


    const defaultPosition = [-34.5950078, -58.3732943]; 
    const defaultZoom = 13;

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

    const customIcon = new Icon({
        iconUrl: "https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png",
        iconSize: [40,40]
    });

    return (
        <MapContainer
        center={mockCoordinates}
        zoom={defaultZoom}
        style={{ height: "300px", width: "100%" }}
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
    );
};

export default MapView;