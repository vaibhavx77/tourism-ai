import React from 'react';
import { styled } from '@mui/system';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
 //This Page need to modify Form Control label
const useStyles = styled((theme) => ({
  root: {
    display: 'flex',
  },
  formControl: {
    minWidth: 225,
    // margin: theme.spacing(3),
  },
}));

export const handlePlacesChange = (schedule, setSchedule, event) => {
  const id = event.target.name;
  const isAdd = event.target.checked;

  if (isAdd) {
    const newSchedule = Array.from(schedule);
    newSchedule.push(id);
    setSchedule(newSchedule);
  } else {
    const newSchedule = Array.from(schedule);
    var index = newSchedule.indexOf(id);
    if (index !== -1) {
      newSchedule.splice(index, 1);
    }
    setSchedule(newSchedule);
  }
};

export function AttractionList(props) {
  const classes = useStyles();

  return (
    <div className={classes.root} style={{paddingLeft: 10}}>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Attraction</FormLabel>
        <FormGroup>

          {props.allPlaces.map((item, index) => (
            <FormControlLabel
              control={<Checkbox checked={props.schedule.includes(item.id)} onChange={props.onChange} name={item.id} />}
              label={item.name.substr(0, 10)}
            />
            ))}
        </FormGroup>
      </FormControl>
    </div>
  );
}
