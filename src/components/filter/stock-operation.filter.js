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

StockOperationFilter.propTypes = {
  filterOption: PropTypes.any, // Define prop type for setFilterOption
  setFilterOption: PropTypes.func,
};

export default function StockOperationFilter(props) {
  const { filterOption, setFilterOption } = props;
  const [goods, setGoods] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const getData = useCallback(async () => {
    try {
      const [goodResponse, stocksResponse, supplierResponse] = await Promise.all([
        axios.get(`/api/v1/good`, {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
        axios.get('/api/v1/stock', {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
        axios.get('/api/v1/supplier', {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
      ]);
      if (
        goodResponse.data.success &&
        stocksResponse.data.success &&
        supplierResponse.data.success
      ) {
        setGoods(goodResponse.data.data);
        setStocks(stocksResponse.data.data);
        setSuppliers(supplierResponse.data.data);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Grid container spacing={1} mx={1} columnSpacing={1} mb={3}>
      <Grid item xs={12}>
        <FormControl sx={{ ml: 1, width: { xs: '18%' } }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="С"
              slotProps={{ textField: { size: 'small' } }}
              value={filterOption.startDate}
              onChange={(date) => setFilterOption({ ...filterOption, startDate: date })}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl sx={{ ml: 2, width: { xs: '18%' } }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="По"
              slotProps={{ textField: { size: 'small' } }}
              value={filterOption.endDate}
              onChange={(date) => setFilterOption({ ...filterOption, endDate: date })}
            />
          </LocalizationProvider>
        </FormControl>

        <FormControl sx={{ ml: { xs: 2 }, width: '18%' }} size="small">
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

        <FormControl sx={{ ml: 2, width: '18%' }} size="small">
          <InputLabel id="demo-select-small-label">Товар</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="GoodFilter"
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

        <FormControl sx={{ ml: 2, width: { xs: '18%' } }} size="small">
          <InputLabel id="demo-select-small-label">Сток</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="StockFilter"
            value={filterOption.stock}
            onChange={(event) => setFilterOption({ ...filterOption, stock: event.target.value })}
          >
            <MenuItem value="">-</MenuItem>
            {stocks.map((stock) => (
              <MenuItem value={stock._id} key={stock._id}>
                {stock.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ ml: 1, mt: 2, width: '18%' }} size="small">
          <InputLabel id="demo-select-small-label">Товар</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            label="GoodFilter"
            value={filterOption.supplier}
            onChange={(event) => setFilterOption({ ...filterOption, supplier: event.target.value })}
          >
            <MenuItem value="">-</MenuItem>
            {suppliers.map((supplier) => (
              <MenuItem value={supplier._id} key={supplier._id}>
                {supplier.companyName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
