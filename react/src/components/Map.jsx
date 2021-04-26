import React, { useState, useRef, useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import io from "socket.io-client"
import './map.css'

const LocationPin = ({ tag}) => (
    <div className="pin">
        <p className="pin-text">{tag}</p>
    </div>
)

const defaultLocation = {
    lat: 0.0,
    lng: 0.0,
}

const defaultZoom = 1;


function Map() {
    // Keep track of the drones in flight
    const [drones, setDrones] = useState([])

    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io.connect('http://drone-transponder.ue.r.appspot.com:5000');
        socketRef.current.on("update_drone_data", data => {
            updateDrones(JSON.parse(data)['drones']);
        });

        return () => socketRef.current.disconnect();
    }, []);

    const updateDrones = (newDrones) => {
        setDrones(newDrones);
    }
    
    const renderLocationPins = () => {
        return drones.map((drone, index) => {
            const {tag, lat, lng} = drone
            return (
                <LocationPin
                    lat={lat}
                    lng={lng}
                    tag={tag}
                />
            )
        })
    }

    return (
        <div className="map">
            <h2 className="map-h2">Drone Locator</h2>
            <div className="google-map">
                <GoogleMapReact
                bootstrapURLKeys={{ key: 'AIzaSyBpyDWnlZ29cIBES0R17rkp3woN3RF5txU' }}
                defaultCenter={defaultLocation}
                defaultZoom={defaultZoom}>
                    {renderLocationPins()}
                
                </GoogleMapReact>
            </div>
        </div>
    )
}

export default Map
