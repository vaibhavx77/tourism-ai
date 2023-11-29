import React from 'react';
import { styled } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
 import Select from '@mui/material/Select';

const useStyles = styled((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function City(props) {
  const classes = useStyles();

  const handleChange = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Destination</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.city}
          onChange={handleChange}
        >
          <MenuItem value={'delhi'}>Delhi</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
