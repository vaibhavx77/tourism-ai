/*global google*/

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const Map = (props) => {
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

  // useEffect(() => {
  //   if (allPlaces.length >= 2 && schedule.length >= 2) {
  //     const waypoints = schedule.slice(1, -1).map(placeId => {
  //       const place = allPlaces.find(p => p.id === placeId);
  //       return place ? { location: place.geometry.location } : null;
  //     }).filter(Boolean);

  //     const origin = allPlaces.find(p => p.id === schedule[0]);
  //     const destination = allPlaces.find(p => p.id === schedule[schedule.length - 1]);

  //     if (origin && destination) {
  //       const directionsService = new window.google.maps.DirectionsService();

  //       directionsService.route(
  //         {
  //           origin: origin.geometry.location,
  //           destination: destination.geometry.location,
  //           waypoints: waypoints,
  //           travelMode: window.google.maps.TravelMode.DRIVING,
  //         },
  //         (result, status) => {
  //           if (status === window.google.maps.DirectionsStatus.OK) {
  //             setDirections(result);
  //           } else {
  //             console.error(`error fetching directions ${result}`);
  //           }
  //         }
  //       );
  //     }
  //   }
  // }, [allPlaces, schedule]);

  return (
    <GoogleMap
      center={{ lat: 28.7041, lng: 77.1025 }}
      zoom={10}
      mapContainerStyle={{ height: '500px', width: '500px' }}
    >
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};

export default Map;
