import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
} from '@material-ui/core';

const DropDownComponent = (props) => {
  const { value, label, name, setValue, data, classes, required, error } = props;

  return (
    <TextField
      id="outlined-required"
      variant="outlined"
      select
      InputLabelProps={{
        shrink: false,
        margin: 'dense',
      }}
      InputProps={{
        className: classes.input,
      }}
      SelectProps={{
        classes: {
          root: classes.selectRoot,
          select: classes.select,
        },
      }}
      name={name}
      value={value}
      label={!value && label}
      onChange={(e) => setValue(name, e.target.value)}
      helperText={error && required && <Box>{label}</Box>}
      error={Boolean(required && !value)}
    >
      {data && data.map((item, i) => {
        return <MenuItem key={i} value={item.value}>
          {item.label}
        </MenuItem>;
      })}
    </TextField>);
};

export default DropDownComponent;