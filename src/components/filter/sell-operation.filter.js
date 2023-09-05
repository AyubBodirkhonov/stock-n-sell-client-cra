import { useState, useEffect, useCallback } from 'react';
import { Grid } from '@mui/material';
import PropTypes from 'prop-types';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { SellOperationStatus } from '../../pages/dictionary/sell-operation.dictionary';
import axios from '../../utils/axios';

SellOperationFilter.propTypes = {
  filterOption: PropTypes.any, // Define prop type for setFilterOption
  setFilterOption: PropTypes.func,
};

export default function SellOperationFilter(props) {
  const { filterOption, setFilterOption } = props;
  const [clients, setClients] = useState([]);
  const [goods, setGoods] = useState([]);

  const getDicts = useCallback(async () => {
    const [clientRes, goodRes] = await Promise.all([
      axios.get('/api/v1/client', {
        headers: { authorization: localStorage.getItem('accessToken') },
      }),
      axios.get('/api/v1/good', {
        headers: { authorization: localStorage.getItem('accessToken') },
      }),
    ]);
    if (clientRes.data.success && goodRes.data.success) {
      setClients(clientRes.data.data);
      setGoods(goodRes.data.data);
    }
  }, []);

  useEffect(() => {
    getDicts();
  }, [getDicts]);

  return (
    <Grid container spacing={1} mx={1} columnSpacing={1} mb={3}>
      <Grid item xs={12}>
        <FormControl sx={{ ml: 1, width: '22%' }} size="small">
          <InputLabel id="demo-select-small-label">Статус</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="StatusFilter"
            value={filterOption.status}
            onChange={(event) => setFilterOption({ ...filterOption, status: event.target.value })}
          >
            <MenuItem value="">-</MenuItem>
            {SellOperationStatus.map((status, index) => (
              <MenuItem value={status.value} key={index}>
                {status.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ ml: 1, width: '22%' }} size="small">
          <InputLabel id="demo-select-small-label">Клиент</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="ClientFilter"
            value={filterOption.client}
            onChange={(event) => setFilterOption({ ...filterOption, client: event.target.value })}
          >
            <MenuItem value="">-</MenuItem>
            {clients.map((client) => (
              <MenuItem value={client._id} key={client._id}>
                {client.companyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ ml: 1, width: '22%' }} size="small">
          <InputLabel id="demo-select-small-label">Товары</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="ClientFilter"
            value={filterOption.good}
            onChange={(event) => setFilterOption({ ...filterOption, good: event.target.value })}
          >
            <MenuItem value="">-</MenuItem>
            {goods.map((good) => (
              <MenuItem value={good._id} key={good._id}>
                {good.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} mt={1}>
        <FormControl sx={{ ml: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="С"
              slotProps={{ textField: { size: 'small' } }}
              value={filterOption.startDate}
              onChange={(date) => setFilterOption({ ...filterOption, startDate: date })}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl sx={{ ml: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="По"
              slotProps={{ textField: { size: 'small' } }}
              value={filterOption.endDate}
              onChange={(date) => setFilterOption({ ...filterOption, endDate: date })}
            />
          </LocalizationProvider>
        </FormControl>
      </Grid>
    </Grid>
  );
}
