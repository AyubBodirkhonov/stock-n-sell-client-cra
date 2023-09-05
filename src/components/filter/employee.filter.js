import { useEffect } from 'react';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

EmployeeFilter.propTypes = {
  departments: PropTypes.array,
  getDepartments: PropTypes.func, // Define prop type for setFilterOption
  filterOptions: PropTypes.any,
  setFilterOptions: PropTypes.func,
  positions: PropTypes.array,
};

export default function EmployeeFilter(props) {
  const { getDepartments, departments, filterOptions, setFilterOptions, positions } = props;

  useEffect(() => {
    getDepartments();
  }, [getDepartments]);
  
  return (
    <Grid container mb={2}>
      <Grid item xs={12}>
        <FormControl sx={{ ml: { xs: 3 }, minWidth: 190 }} size="small">
          <InputLabel id="demo-select-small-label">Деп.</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="FinanceFilter"
            value={filterOptions.department}
            onChange={(event) =>
              setFilterOptions({ ...filterOptions, department: event.target.value })
            }
          >
            <MenuItem value="">-</MenuItem>
            {departments.map((department, index) => (
              <MenuItem value={department._id} key={index}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ ml: { xs: 3 }, minWidth: 190 }} size="small">
          <InputLabel id="demo-select-small-label">Должность</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="FinanceFilter"
            value={filterOptions.position}
            onChange={(event) =>
              setFilterOptions({ ...filterOptions, position: event.target.value })
            }
          >
            <MenuItem value="">-</MenuItem>
            {positions.map((position, index) => (
              <MenuItem value={position._id} key={index}>
                {position.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
