/*global google*/
import './App.css';
import axios from 'axios';
import React, { useState } from 'react';
import DatePicker from './Component/Date';
import City from './Component/City';
import Preferences from './Component/Preferences';
import { AttractionList, handlePlacesChange } from './Component/AttractionList';
import { GoogleMap, LoadScript } from '@react-google-maps/api'; // Import GoogleMap and LoadScript
import Map from './Component/Map';
import { Schedule, onDragEnd } from './Component/Schedule';
import callAPIs from './utils';
import Button from '@mui/material/Button';
import Logo from './Image/Logo.png';
 
function App() {
  const [show, toggleShow] = useState(false);
  const [city, setCity] = useState("delhi");
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [priceLevel, setPriceLevel] = useState(2);
  const [outDoor, setOutdoor] = useState(0.5);
  const [compactness, setCompactness] = useState(0.5);
  const [startTime, setStartTime] = useState("09:30");
  const [backTime, setBackTime] = useState("21:00");
  const [schedule, setSchedule] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);

  const onSearchClicked = () => {
    const embeddedSearchFields = {
      city: city,
      departureDate: departureDate,
      returnDate: returnDate,
      priceLevel: priceLevel,
      outDoor: outDoor,
      compactness: compactness,
      startTime: startTime,
      backTime: backTime,
      schedule: schedule,
    };
    callAPIs(embeddedSearchFields, setAllPlaces, setSchedule);
  };

  const handleDrag = (result) => {
    onDragEnd(schedule, setSchedule, result);
  };

  const handleTick = (event) => {
    handlePlacesChange(schedule, setSchedule, event);
  };

  const googleMapsApiKey = 'AIzaSyDCNt5DST18CgfQJaZ3W-aD9pWQ7PuOTTE'; // Replace with your actual API key

  return (
    <div className="App">
      <div className="App-header">
        <img src={Logo} width="225" alt="Logo" />
      </div>
      <div className="input row">
        <City city={city} onChange={setCity}></City>
        <DatePicker
          departureDate={departureDate}
          departureDateOnChange={setDepartureDate}
          returnDate={returnDate}
          returnDateOnChange={setReturnDate}
        ></DatePicker>
        <Button id="search" variant="contained" onClick={onSearchClicked}>Search</Button>
      </div>
      <div className="indented column">
        <Button onClick={() => toggleShow(!show)}>
          {show ? "collapse" : "other preferences"}
        </Button>
        {show && <Preferences
          priceLevel={priceLevel} priceLevelOnChange={setPriceLevel}
          outDoor={outDoor} outDoorOnChange={setOutdoor}
          compactness={compactness} compactnessOnChange={setCompactness}
          startTime={startTime} startTimeOnChange={setStartTime}
          backTime={backTime} backTimeOnChange={setBackTime}
        />}
      </div>
      <div className="indented row">
        <AttractionList
          allPlaces={allPlaces}
          schedule={schedule}
          onChange={handleTick}
        />
        <Schedule
          schedule={schedule}
          allPlaces={allPlaces}
          onDragEnd={handleDrag}
        />
        <div id="map">
          <LoadScript
            googleMapsApiKey={googleMapsApiKey}
          >
            <GoogleMap
              center={{ lat: 28.7041, lng: 77.1025}} // Provide initial center coordinates
              zoom={10} // Set the initial zoom level
              mapContainerStyle={{ height: "500px", width: "500px" }}
            >
              <Map
                loadingElement={<div style={{ height: "100%" }} />}
                schedule={schedule}
                allPlaces={allPlaces}
              />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
      <div className="App-footer"></div>
    </div>
  );
}

export default App;
