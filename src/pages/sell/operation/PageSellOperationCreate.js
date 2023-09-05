import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';

// Form input imports
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import { useNavigate } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import axios from '../../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';

export default function PageSellOperationCreate() {
  const { enqueueSnackbar } = useSnackbar();
  const [operation, setOperation] = useState({
    client: '',
    items: [],
    leftToPay: 0,
    paidInCash: 0,
    paidInNoCash: 0,
    profit: 0,
    totalPrice: 0,
    totallyPaid: 0,
    comment: '',
    fromStock: '',
    createdAt: '',
  });

  const [item, setItem] = useState({
    good: '',
    basePricePerProduct: 0,
    pricePerProduct: 0,
    amount: 0,
    itemTotalPrice: 0,
    profit: 0,
  });

  const [clients, setClients] = useState([]);
  const [goods, setGoods] = useState([]);
  const [goodBasePrice, setGoodBasePrice] = useState([]);
  const [goodCategories, setGoodCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  // Validations
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const validForm = () => {
    let valid = false;

    if (
      item.good &&
      item.basePricePerProduct > 0 &&
      item.pricePerProduct > 0 &&
      item.amount > 0 &&
      item.itemTotalPrice > 0 &&
      item.profit > 0
    ) {
      valid = true;
    }
    return valid;
  };

  const saveValidForm = () => {
    let valid = false;

    if (
      operation.client &&
      operation.paidInCash >= 0 &&
      operation.paidInNoCash >= 0 &&
      !buttonDisabled
    ) {
      valid = true;
    }
    return valid;
  };

  const getDicts = useCallback(async () => {
    try {
      const [clientRes, goodRes, categoryRes, stockRes] = await Promise.all([
        axios.get(`/api/v1/client/`, {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
        axios.get(`/api/v1/good/`, {
          headers: { authorization: localStorage.getItem('accessToken') },
          params: { category },
        }),
        axios.get(`/api/v1/good-category/`, {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
        axios.get(`/api/v1/stock/`, {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
      ]);

      if (clientRes.data.success && goodRes.data.success && categoryRes.data.success) {
        setClients(clientRes.data.data);
        setGoods(goodRes.data.data);
        setGoodCategories(categoryRes.data.data);
        setStocks(stockRes.data.data);
      } else {
        enqueueSnackbar(SnackbarMessage.error.unexpectedError, {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  }, [enqueueSnackbar, category]);

  // API GOOD-BASE-PRICE
  const goodBasePriceInfo = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/good-base-price/`, {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          good: item.good,
        },
      });

      if (response.data.success) {
        setGoodBasePrice(response.data.data);
      } else {
        enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(response.data.error[0])], {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  }, [enqueueSnackbar, item.good]);

  useEffect(() => {
    getDicts();
    goodBasePriceInfo();
  }, [getDicts, goodBasePriceInfo]);

  const calcProfitAndTotalPrice = () => {
    let profit = 0;
    let totalPrice = 0;

    operation.items.forEach((i) => {
      profit += i.profit;
      totalPrice += +i.itemTotalPrice;
    });

    setOperation({ ...operation, profit, totalPrice });
  };

  const addItemHandler = () => {
    if (!validForm()) {
      enqueueSnackbar(SnackbarMessage.error.invalidFields, {
        variant: SnackbarType.error,
      });
    } else {
      operation.items.push(item);

      setItem({
        good: {},
        basePricePerProduct: 0,
        pricePerProduct: 0,
        amount: 0,
        itemTotalPrice: 0,
        profit: 0,
      });
      calcProfitAndTotalPrice();

      // Display success message
      enqueueSnackbar(SnackbarMessage.info.sellItemAdded, { variant: SnackbarType.info });
    }
  };

  const saveItemsHandler = async () => {
    setButtonDisabled(() => true);

    try {
      const response = await axios.post(
        '/api/v1/sell-operation',
        {
          ...operation,
          paidInCash: +operation.paidInCash,
          paidInNoCash: +operation.paidInNoCash,
          fromStock: stocks.filter((stock) => stock._id === operation.fromStock)[0],
        },
        {
          headers: { authorization: localStorage.getItem('accessToken') },
        }
      );
      console.log({ response });

      if (response.data.success) {
        enqueueSnackbar(SnackbarMessage.success.sellOperationAdded, {
          variant: SnackbarType.success,
        });
        navigate('/dashboard/operation/sell-operation');
      } else {
        enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(response.data.error[0])], {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  };

  const removeHandler = (goodId) => {
    const removingItems = operation.items.filter((i) => i.good === goodId);
    const items = operation.items.filter((i) => i.good !== goodId);

    for (let i = 0; i < removingItems.length; i += 1) {
      operation.totalPrice -= removingItems[i].itemTotalPrice;
      operation.profit -= removingItems[i].profit;
      setOperation({ ...operation, items });
    }

    enqueueSnackbar(SnackbarMessage.warning.sellItemRemoved, {
      variant: SnackbarType.warning,
    });
  };

  return (
    <>
      <Helmet>
        <title>Новая продажа</title>
      </Helmet>
      <Container sx={{ position: 'relative' }}>
        <Typography variant="h3" component="h1" paragraph>
          Создать новую продажу
        </Typography>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={3} my={4}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                p: 2,
                gap: '10px',
              }}
            >
              <Typography variant="h4">{operation.totalPrice?.toLocaleString()}</Typography>
              <Typography variant="h7">Общая сумма</Typography>
            </Card>
          </Grid>
          <Grid item xs={3} my={4}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                p: 2,
                gap: '10px',
              }}
            >
              <Typography variant="h4">{operation.totallyPaid?.toLocaleString()}</Typography>
              <Typography variant="h7">Общий платеж</Typography>
            </Card>
          </Grid>
          <Grid item xs={3} my={4}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                p: 2,
                gap: '10px',
              }}
            >
              <Typography variant="h4">{operation.leftToPay?.toLocaleString()}</Typography>
              <Typography variant="h7">Осталок платежа</Typography>
            </Card>
          </Grid>
          <Grid item xs={3} my={4}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                p: 2,
                gap: '10px',
              }}
            >
              <Typography variant="h4">{operation.profit?.toLocaleString()}</Typography>
              <Typography variant="h7">Прибыль</Typography>
            </Card>
          </Grid>

          {/*  Table Info */}
          <TableContainer component={Paper} sx={{ marginLeft: '15px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Категория товара</TableCell>
                  <TableCell align="center">Товар</TableCell>
                  <TableCell align="center">Себестоимость</TableCell>
                  <TableCell align="center">Цена</TableCell>
                  <TableCell align="center">Кол-во</TableCell>
                  <TableCell align="center">Сумма</TableCell>
                  <TableCell align="center">Прибыль</TableCell>
                  <TableCell align="center">Действие</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {operation.items.map((tableItem, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {goods.filter((good) => good._id === tableItem.good)[0].category?.name}
                    </TableCell>
                    <TableCell align="center">
                      {goods.filter((good) => good._id === tableItem.good)[0]?.name}
                    </TableCell>
                    <TableCell align="center">
                      {tableItem.basePricePerProduct?.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      {tableItem.pricePerProduct?.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">{tableItem.amount?.toLocaleString()}</TableCell>
                    <TableCell align="center">
                      {tableItem.itemTotalPrice?.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">{tableItem.profit?.toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => {
                          removeHandler(tableItem.good);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Add To Table */}

        <Grid item xs={12} my={2}>
          <Stack direction="row" spacing={2} mb={2} alignItems="center">
            <Typography variant="h5">Шаг 1</Typography>
          </Stack>
          <Card
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 3,
              gap: '15px',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            <FormControl sx={{ width: '24%' }}>
              <InputLabel id="demo-select-small-label">Товарная категория</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Good filter"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                }}
              >
                <MenuItem value="">-</MenuItem>
                {goodCategories.map((cat, index) => (
                  <MenuItem value={cat._id} key={index}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: '24%' }}>
              <InputLabel id="demo-select-small-label">Товар</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Good filter"
                value={item.good}
                onChange={(event) => {
                  setItem({ ...item, good: event.target.value });
                }}
              >
                <MenuItem value="">-</MenuItem>
                {goods.map((good, index) => (
                  <MenuItem value={good._id} key={index}>
                    {good.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ width: '24%' }}>
              <TextField
                id="outlined"
                label="Кол-во"
                type="number"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={item.amount}
                onChange={(event) =>
                  setItem({
                    ...item,
                    amount: event.target.value,
                    itemTotalPrice: item.pricePerProduct * event.target.value,
                    profit: (item.pricePerProduct - item.basePricePerProduct) * event.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl sx={{ width: '23%' }}>
              <InputLabel id="demo-select-small-label">Себестоимость</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="FinanceFilter"
                value={item.basePricePerProduct}
                onChange={(event) =>
                  setItem({
                    ...item,
                    basePricePerProduct: event.target.value,
                    profit: (item.pricePerProduct - event.target.value) * item.amount,
                  })
                }
              >
                <MenuItem value="">-</MenuItem>
                {goodBasePrice.map((price, index) => (
                  <MenuItem value={price.basePrice} key={index}>
                    {price.basePrice?.toLocaleString()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: '24%' }}>
              <TextField
                id="outlined"
                label="Цена"
                type="number"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={item.pricePerProduct}
                onChange={(event) => {
                  setItem({
                    ...item,
                    pricePerProduct: event.target.value,
                    itemTotalPrice: event.target.value * item.amount,
                    profit: (event.target.value - item.basePricePerProduct) * item.amount,
                  });
                }}
              />
            </FormControl>
            <FormControl sx={{ width: '24%' }}>
              <TextField
                id="outlined"
                label="Общая сумма"
                type="number"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={item.itemTotalPrice}
                disabled
              />
            </FormControl>
            <FormControl sx={{ width: '24%' }}>
              <TextField
                id="outlined"
                label="Прибыль"
                type="number"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={item.profit}
                disabled
              />
            </FormControl>
            <Button
              variant="contained"
              // disabled={!validForm()}
              onClick={addItemHandler}
            >
              Добавить в список
            </Button>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} mb={2} alignItems="center">
            <Typography variant="h5">Шаг 2</Typography>
          </Stack>
          <Card
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 3,
              gap: '15px',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            <FormControl sx={{ width: '24%' }}>
              <InputLabel id="demo-select-small-label">Склад</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Stock filter"
                value={operation.fromStock}
                onChange={(event) => {
                  setOperation({ ...operation, fromStock: event.target.value });
                }}
              >
                <MenuItem value="">-</MenuItem>
                {stocks.map((stock, index) => (
                  <MenuItem value={stock._id} key={index}>
                    {stock.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: '24%' }}>
              <InputLabel id="demo-select-small-label">Клиент</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="FinanceFilter"
                value={operation.client}
                onChange={(event) => setOperation({ ...operation, client: event.target.value })}
              >
                <MenuItem value="">-</MenuItem>
                {clients.map((client, index) => (
                  <MenuItem value={client._id} key={index}>
                    {client.companyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ width: '24%' }}>
              <TextField
                id="outlined"
                label="Наличные"
                type="number"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={operation.paidInCash}
                onChange={(event) => {
                  setOperation({
                    ...operation,
                    paidInCash: event.target.value,
                    totallyPaid: +event.target.value + +operation.paidInNoCash,
                    leftToPay:
                      operation.totalPrice - (+operation.paidInNoCash + +event.target.value),
                  });
                }}
              />
            </FormControl>
            <FormControl sx={{ width: '23%' }}>
              <TextField
                id="outlined"
                label="Безналичные"
                type="number"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={operation.paidInNoCash}
                onChange={(event) => {
                  setOperation({
                    ...operation,
                    paidInNoCash: event.target.value,
                    totallyPaid: +operation.paidInCash + +event.target.value,
                    leftToPay: operation.totalPrice - (+operation.paidInCash + +event.target.value),
                  });
                }}
              />
            </FormControl>

            <FormControl sx={{ width: '23%' }} size="medium">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']} sx={{ paddingTop: 0 }}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label="Дата операции"
                    onChange={(date) => setOperation({ ...operation, createdAt: date })}
                    slotProps={{ textField: { size: 'medium' } }}
                    sx={{ width: '100%' }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>

            <FormControl sx={{ width: '74.75%' }}>
              <TextField
                fullWidth
                label="Комментарий"
                value={operation.comment}
                onChange={(event) => setOperation({ ...operation, comment: event.target.value })}
              />
            </FormControl>

            <Button
              variant="contained"
              size="large"
              sx={{ width: '100%', margin: '0 auto' }}
              disabled={!saveValidForm()}
              onClick={saveItemsHandler}
            >
              Сохранить
            </Button>
          </Card>
        </Grid>
      </Container>
    </>
  );
}
