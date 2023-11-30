import 'date-fns';
import React from 'react';
import { Grid, TextField } from '@mui/material';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'; // Import the DateAdapter
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'; // Import the LocalizationProvider
import {DesktopDatePicker} from '@mui/x-date-pickers/DesktopDatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';

export default function DatePicker(props) {
  
  const handleDepartureDateChange = (date) => {
    props.departureDateOnChange(date);
  };

  const handleReturnDateChange = (date) => {
    props.returnDateOnChange(date);
  };



  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}> {/* Set the DateAdapter */}
      <Grid container justifyContent="space-evenly">
      
        <DesktopDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="Departure Date"
          label="Departure Date"
          value={props.departureDate}
          onChange={handleDepartureDateChange}
          renderInput={(params) => <TextField {...params} />}
          
        />
        
        <DesktopDatePicker
          disableToolbar
          variant="inline"
          margin="normal"
          id="Return Date"
          label="Return Date"
          format="MM/dd/yyyy"
          value={props.returnDate}
          onChange={handleReturnDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Grid>
    </LocalizationProvider>
  );
}
