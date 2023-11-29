import React from 'react';
import { styled } from '@mui/system';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';

const useStyles = styled({
  root: {
    width: 300,
  },
});

function valuetext(value) {
  return `${value}°C`;
}

export default function Preferences(props) {
  const classes = useStyles();
  
  const handlePriceLevelChange = (event, newValue) => {
    props.priceLevelOnChange(newValue);
  }

  const handleOutDoorChange = (event, newValue) => {
    props.outDoorOnChange(newValue);
  }

  const handleCompactnessChange = (event, newValue) => {
    props.compactnessOnChange(newValue);
  }

  const handleStartTimeChange = (event, newValue) => {
    props.startTimeOnChange(newValue);
  }

  const handleBackTimeChange = (event, newValue) => {
    props.backTimeOnChange(newValue);
  }

  const budgetMarks = [
    {
      value: 0,
      label: '$',
    },
    {
      value: 1,
      label: '$$',
    },
    {
      value: 2,
      label: '$$$',
    },
    {
      value: 3,
      label: '$$$$',
    },
    {
      value: 4,
      label: '$$$$$',
    },
  ];

  const indoorMarks = [
    {
      value: 0,
      label: 'indoor',
    },
    {
      value: 1,
      label: 'outdoor',
    },
  ];

  const compactMarks = [
    {
      value: 0,
      label: 'light',
    },
    {
      value: 1,
      label: 'compact',
    },
  ];

  
  return (
    <div className={classes.root} style={{paddingTop: 4, paddingLeft: 10}}>
      <form className={classes.container} noValidate>
        <TextField
          style={{paddingRight: 20}}
          id="departHrMin"
          label="Depart Time"
          type="time"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          value={props.startTime}
          onChange={handleStartTimeChange}
        />
        <TextField
          id="backHrMin"
          label="Back Time"
          type="time"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          value={props.backTime}
          onChange={handleBackTimeChange}
        />
      </form>
      <Typography id="budget-typo" variant="body2" style={{paddingTop: 12}}>
        Budget
      </Typography>
      <Slider
        defaultValue={2}
        getAriaValueText={valuetext}
        aria-labelledby="budget-slider"
        valueLabelDisplay="auto"
        step={1}
        min={0}
        max={4}
        value={props.priceLevel}
        onChange={handlePriceLevelChange}
        marks={budgetMarks}
      />
      <Typography id="outdoor-typo" variant="body2" style={{paddingTop: 12}}>
        Prefer Indoor Outdoor
      </Typography>
      <Slider 
        value={props.outDoor} 
        onChange={handleOutDoorChange} 
        aria-labelledby="continuous-slider" 
        step= {0.01}
        min = {0}
        max = {1}
        marks={indoorMarks}
      />
      <Typography id="compact-typo" variant="body2" style={{paddingTop: 12}}>
        Compactness
      </Typography>
      <Slider 
        value={props.compactness} 
        onChange={handleCompactnessChange} 
        aria-labelledby="continuous-slider" 
        step= {0.01}
        min = {0}
        max = {1}
        marks={compactMarks}
      />
    </div>
  );
}
