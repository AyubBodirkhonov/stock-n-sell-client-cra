import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  PaymentStatusDict,
  PaymentStatusEnum,
  PaymentTypeDict,
} from '../../pages/dictionary/payment.dictionary';

PaymentFilter.propTypes = {
  filterOption: PropTypes.any, // Define prop type for filterOption
  setFilterOption: PropTypes.func, // Define prop type for setFilterOption
};

export default function PaymentFilter(props) {
  const { filterOption, setFilterOption } = props;

  return (
    <Grid container spacing={1} mx={1} columnSpacing={1} mb={3}>
      <Grid item md={12}>
        <FormControl sx={{ ml: { xs: 2 }, width: { md: '20%', xl: '22%' } }} size="small">
          <InputLabel id="demo-select-small-label">Тип</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="StatusFilter"
            value={filterOption.type}
            onChange={(event) => setFilterOption({ ...filterOption, type: event.target.value })}
          >
            <MenuItem value="">-</MenuItem>
            {PaymentTypeDict.map((type, index) => (
              <MenuItem value={type.value} key={index}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ ml: { xs: 2 }, width: { md: '20%', xl: '22%' } }} size="small">
          <InputLabel id="demo-select-small-label">Статус</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="StatusFilter"
            value={filterOption.status}
            onChange={(event) => setFilterOption({ ...filterOption, status: event.target.value })}
          >
            <MenuItem value="">-</MenuItem>
            {PaymentStatusDict.map((status, index) => (
              <MenuItem value={status.value} key={index}>
                {status.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ ml: 2, width: { md: '20%', xl: '22%' } }} size="small">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              inputFormat="DD/MM/YYYY"
              label="С:"
              onChange={(date) => setFilterOption({ ...filterOption, startDate: date })}
              slotProps={{ textField: { size: 'small' } }}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl sx={{ ml: 2, width: { md: '20%', xl: '22%' } }} size="small">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              inputFormat="DD/MM/YYYY"
              label="По:"
              onChange={(date) => setFilterOption({ ...filterOption, endDate: date })}
              slotProps={{ textField: { size: 'small' } }}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl sx={{ ml: 2, width: { md: '20%', xl: '22%' } }} size="small">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              inputFormat="DD/MM/YYYY"
              disabled={filterOption.status === PaymentStatusEnum.conducted}
              label="С (заланированный)"
              onChange={(date) => setFilterOption({ ...filterOption, plannedStartDate: date })}
              slotProps={{ textField: { size: 'small' } }}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl sx={{ ml: 2, width: { md: '20%', xl: '22%' } }} size="small">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              disabled={filterOption.status === PaymentStatusEnum.conducted}
              inputFormat="DD/MM/YYYY"
              label="По (заланированный)"
              onChange={(date) => setFilterOption({ ...filterOption, plannedEndDate: date })}
              slotProps={{ textField: { size: 'small' } }}
              sx={{ width: '100%' }}
            />
          </LocalizationProvider>
        </FormControl>
      </Grid>
    </Grid>
  );
}
