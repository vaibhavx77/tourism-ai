/* global google */
import React, { useEffect, useState } from "react";
import { GoogleMap, DirectionsRenderer, LoadScript } from "@react-google-maps/api";

export function Map(props) {
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const directionsService = new google.maps.DirectionsService();
    const backupOrigin = null; // { lat: 40.756795, lng: -73.954298 };
    const backupDestination = null; // { lat: 41.756795, lng: -78.954298 };

    if (props.allPlaces[0]) console.log(props.allPlaces[0].geometry.location);

    const beginId = props.schedule[0] ? props.schedule[0] : null;
    const endId = (props.schedule.length > 0 && props.schedule[props.schedule.length - 1]) ?
      props.schedule[props.schedule.length - 1] : null;
    const beginLocation = beginId ? props.allPlaces.find(element => element.id === beginId).geometry.location : backupOrigin;
    const endLocation = endId ? props.allPlaces.find(element => element.id === endId).geometry.location : backupDestination;
    const wayPoints = [];
    if (props.schedule && props.allPlaces) {
      for (let i = 1; i < props.schedule.length - 1; ++i) {
        const loc = props.allPlaces.find(element => element.id === props.schedule[i]).geometry;
        const locObject = {
          location: new google.maps.LatLng(loc.location.lat, loc.location.lng)
        };
        wayPoints.push(locObject);
      }
    }
    directionsService.route(
      {
        origin: beginLocation,
        destination: endLocation,
        waypoints: wayPoints,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [props.allPlaces, props.schedule]);

  return (
    <div>
      <LoadScript
        googleMapsApiKey="AIzaSyDCNt5DST18CgfQJaZ3W-aD9pWQ7PuOTTE"
      >
        <GoogleMap
          center={{ lat: 25.033964, lng: 121.564468 }}
          zoom={12}
          mapContainerStyle={{ height: "500px", width: "500px" }}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
