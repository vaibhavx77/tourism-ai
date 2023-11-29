/*global google*/
import './App.css';
import React, { useState } from 'react';
import DatePicker from './Component/Date';
import City from './Component/City';
import Preferences from './Component/Preferences';
import { AttractionList, handlePlacesChange } from './Component/AttractionList';
import { Map } from './Component/Map';
import { Schedule, onDragEnd } from './Component/Schedule';
import callAPIs from './utils';
import Button from '@mui/material/Button';
import { LoadScript } from '@react-google-maps/api';
import Logo from './Image/Logo.png';

function App() {
  const [show, toggleShow] = useState(false);
  const [city, setCity] = useState("taipei");
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
            <Map
              loadingElement={<div style={{ height: "100%" }} />}
              schedule={schedule}
              allPlaces={allPlaces}
            />
          </LoadScript>
        </div>
      </div>
      <div className="App-footer"></div>
    </div>
  );
}

export default App;
