import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Modal,
  Button,
  Stack,
  Grid,
  Card,
  Tooltip,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

// Form input imports
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import { useNavigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSnackbar } from 'notistack';
import { useSettingsContext } from '../../../components/settings';
import axios from '../../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';

export default function PageStockOperationCreate() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [operation, setOperation] = useState({
    supplier: '',
    stock: '',
    items: [],
    paidInCash: 0,
    paidInNoCash: 0,
    totalPrice: 0,
    leftToPay: 0,
    totallyPaid: 0,
    createdAt: '',
  });

  const [item, setItem] = useState({
    good: {},
    basePrice: 0,
    basePricePerProduct: 0,
    customsDuty: null,
    purchasePrice: null,
    amount: null,
    transportationPrice: null,
    otherExpenses: null,
  });

  const [suppliers, setSuppliers] = useState([]);
  const [goods, setGoods] = useState([]);
  const [goodCategories, setGoodCategories] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [goodCategory, setGoodCategory] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [totalStats, setTotalStats] = useState({
    totalPurchasePrice: 0,
    totalTransportationPrice: 0,
    totalCustomsDuty: 0,
    totalOtherExpenses: 0,
    totalExpenses: 0,
  });

  const navigate = useNavigate();
  // Validations
  const validForm = () => {
    let valid = false;

    if (
      item.good &&
      item.basePricePerProduct > 0 &&
      item.basePrice > 0 &&
      item.amount > 0 &&
      item.purchasePrice > 0 &&
      item.transportationPrice >= 0 &&
      item.otherExpenses >= 0 &&
      item.customsDuty >= 0
    ) {
      valid = true;
    }
    return valid;
  };

  const saveValidForm = () => {
    let valid = false;

    if (
      operation.supplier &&
      operation.paidInCash >= 0 &&
      operation.paidInNoCash >= 0 &&
      operation.stock &&
      operation.items.length &&
      !buttonDisabled
    ) {
      valid = true;
    }
    return valid;
  };

  // API CLIENT
  const supplierInfo = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/supplier/`, {
        headers: { authorization: localStorage.getItem('accessToken') },
      });

      if (response.data.success) {
        setSuppliers(response.data.data);
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
  }, [enqueueSnackbar]);

  // API GOOD
  const goodInfo = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/good/`, {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          category: goodCategory,
        },
      });

      if (response.data.success) {
        setGoods(response.data.data);
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
  }, [goodCategory, enqueueSnackbar]);

  // API GOODCATEGORY
  const goodCategoryInfo = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/good-category/`, {
        headers: { authorization: localStorage.getItem('accessToken') },
      });

      if (response.data.success) {
        setGoodCategories(response.data.data);
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
  }, [enqueueSnackbar]);

  // API STOCK

  const stockData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/stock', {
        headers: { authorization: localStorage.getItem('accessToken') },
      });

      if (response.data.success) {
        setStocks(response.data.data);
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
  }, [enqueueSnackbar]);

  useEffect(() => {
    supplierInfo();
    goodInfo();
    goodCategoryInfo();
    stockData();
  }, [supplierInfo, goodInfo, goodCategoryInfo, stockData]);

  const calcBasePriceAndPerProduct = () => {
    const basePrice =
      +item.customsDuty + +item.transportationPrice + +item.purchasePrice + +item.otherExpenses;
    const basePricePerProduct = Math.round((basePrice * 100) / +item.amount) / 100;
    setItem({ ...item, basePrice, basePricePerProduct });
  };

  const calcBaseStatistic = () => {
    let totalPurchasePrice = 0;
    let totalTransportationPrice = 0;
    let totalCustomsDuty = 0;
    let totalOtherExpenses = 0;
    let totalExpenses = 0;

    if (operation.items.length) {
      operation.items.forEach((i) => {
        totalPurchasePrice += +i.purchasePrice;
        totalTransportationPrice += +i.transportationPrice;
        totalCustomsDuty += +i.customsDuty;
        totalOtherExpenses += +i.otherExpenses;
      });
      totalExpenses =
        totalPurchasePrice + totalTransportationPrice + totalCustomsDuty + totalOtherExpenses;
    }
    setOperation({ ...operation, totalPrice: totalExpenses });
    setTotalStats({
      totalPurchasePrice,
      totalTransportationPrice,
      totalCustomsDuty,
      totalOtherExpenses,
      totalExpenses,
    });
  };

  const saveItemsHandler = async () => {
    setButtonDisabled(() => true);

    try {
      const response = await axios.post(
        '/api/v1/stock-operation',
        {
          ...operation,
          paidInCash: +operation.paidInCash,
          paidInNoCash: +operation.paidInNoCash,
          leftToPay: +operation.totalPrice - +operation.paidInCash - +operation.paidInNoCash,
          totallyPaid: +operation.paidInCash + +operation.paidInNoCash,
        },

        {
          headers: { authorization: localStorage.getItem('accessToken') },
        }
      );
      if (response.data.success) {
        navigate('/dashboard/operation/stock-operation');
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

  const addItemHandler = () => {
    operation.items.push({
      ...item,
      customsDuty: +item.customsDuty,
      purchasePrice: +item.purchasePrice,
      amount: +item.amount,
      transportationPrice: +item.transportationPrice,
      otherExpenses: +item.otherExpenses,
    });

    calcBasePriceAndPerProduct();
    calcBaseStatistic();

    setItem({
      good: '',
      basePrice: 0,
      basePricePerProduct: 0,
      customsDuty: 0,
      purchasePrice: 0,
      amount: 0,
      transportationPrice: 0,
      otherExpenses: 0,
    });
  };

  const removeHandler = (goodId) => {
    operation.items = operation.items.filter((i) => i.good !== goodId);

    setOperation({ ...operation });
    calcBaseStatistic();
  };

  return (
    <>
      <Helmet>
        <title> Новая продажа</title>
      </Helmet>
      <Container sx={{ position: 'relative' }} maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3" component="h1" paragraph>
          Создать новую продажу
        </Typography>

        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={2.4} my={4}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                p: 2,
                gap: '10px',
                height: '140px',
              }}
            >
              <Typography variant="h4">
                {totalStats.totalPurchasePrice?.toLocaleString()}
              </Typography>
              <Tooltip title="На какую сумму были куплены ниже-указанные товары">
                <Typography variant="h7" textAlign="center">
                  Общая сумма покупки
                </Typography>
              </Tooltip>
            </Card>
          </Grid>
          <Grid item xs={2.4} my={4}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                p: 2,
                gap: '10px',
                height: '140px',
              }}
            >
              <Typography variant="h4">
                {totalStats.totalTransportationPrice?.toLocaleString()}
              </Typography>
              <Tooltip title="На какую сумму были транспортированы ниже-указанные товары">
                <Typography variant="h7" textAlign="center">
                  Общая сумма транпортировки
                </Typography>
              </Tooltip>
            </Card>
          </Grid>
          <Grid item xs={2.4} my={4}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                p: 2,
                gap: '10px',
                height: { xs: 'auto', xl: '140px' },
              }}
            >
              <Typography variant="h4">{totalStats.totalCustomsDuty?.toLocaleString()}</Typography>

              <Tooltip title="На какую сумму были растоможены ниже-указанные товары">
                <Typography variant="h7" textAlign="center">
                  Общая сумма таможенной пошлины
                </Typography>
              </Tooltip>
            </Card>
          </Grid>
          <Grid item xs={2.4} my={4}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                p: 2,
                gap: '10px',
                height: '140px',
              }}
            >
              <Typography variant="h4">
                {totalStats.totalOtherExpenses?.toLocaleString()}
              </Typography>
              <Tooltip title="Общая сумма других расходов при покупке, перевозке и растоможке товаров">
                <Typography variant="h7" textAlign="center">
                  Общие другие расходы
                </Typography>
              </Tooltip>
            </Card>
          </Grid>
          <Grid item xs={2.4} my={4}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                p: 2,
                gap: '10px',
                height: '140px',
              }}
            >
              <Typography variant="h4">{totalStats.totalExpenses?.toLocaleString()}</Typography>
              <Tooltip title="Общая сумма всех затрат (сумма покупок + сумма транспорта + сумма растоможки + другие расходы)">
                <Typography variant="h7">Общие затраты</Typography>
              </Tooltip>
            </Card>
          </Grid>
        </Grid>

        {/*  Table Info */}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row" align="center">
                  Товарная категория
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  Товар
                </TableCell>
                <TableCell align="center">Кол-во</TableCell>
                <TableCell align="center">Цена закупа</TableCell>
                <TableCell align="center">Транспорт</TableCell>
                <TableCell align="center">Таможенная пошлина</TableCell>
                <TableCell align="center">Другие расходы</TableCell>
                <TableCell align="center">Общая себестоимость</TableCell>
                <TableCell align="center">Себестоимость 1 ед. товара</TableCell>
                <TableCell align="center">Действие</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operation.items.map((tableItem, index) => (
                <TableRow key={index}>
                  <TableCell align="center">
                    {goods.filter((good) => good._id === tableItem.good)[0].category.name}
                  </TableCell>
                  <TableCell align="center">
                    {goods.filter((good) => good._id === tableItem.good)[0].name}
                    {/* .filter((good) => good._id === tableItem.good)[0].name */}
                  </TableCell>
                  <TableCell align="center">{(+tableItem.amount)?.toLocaleString()}</TableCell>

                  <TableCell align="center">
                    {(+tableItem.purchasePrice)?.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    {(+tableItem.transportationPrice)?.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">{(+tableItem.customsDuty)?.toLocaleString()}</TableCell>
                  <TableCell align="center">
                    {(+tableItem.otherExpenses)?.toLocaleString()}
                  </TableCell>
                  <TableCell align="center">{(+tableItem.basePrice)?.toLocaleString()}</TableCell>
                  <TableCell align="center">
                    {tableItem.basePricePerProduct?.toLocaleString()}
                  </TableCell>
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

        {/* Add To Table */}

        <Grid container>
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
              <FormControl sx={{ width: '19%' }}>
                <InputLabel id="demo-select-small-label">Товарная категория</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  label="FinanceFilter"
                  value={goodCategory._id}
                  onChange={(event) =>
                    setGoodCategory({ ...goodCategory, _id: event.target.value })
                  }
                >
                  <MenuItem value="">-</MenuItem>
                  {goodCategories.map((category, index) => (
                    <MenuItem value={category._id} key={index}>
                      {category?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ width: '19%' }}>
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

              <FormControl sx={{ width: '19%' }}>
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
                      basePrice:
                        +item.customsDuty +
                        +item.transportationPrice +
                        +item.purchasePrice +
                        +item.otherExpenses,
                      basePricePerProduct: +item.basePrice / +event.target.value,
                    })
                  }
                />
              </FormControl>

              <FormControl sx={{ width: '19%' }}>
                <TextField
                  id="outlined"
                  label="Цена покупки"
                  type="number"
                  variant="outlined"
                  sx={{ width: '100%' }}
                  autoComplete="off"
                  value={item.purchasePrice}
                  onChange={(event) =>
                    setItem({
                      ...item,
                      purchasePrice: event.target.value,
                      basePrice:
                        +item.customsDuty +
                        +item.transportationPrice +
                        +event.target.value +
                        +item.otherExpenses,
                      basePricePerProduct:
                        +(
                          +item.customsDuty +
                          +item.transportationPrice +
                          +event.target.value +
                          +item.otherExpenses
                        ) / +item.amount,
                    })
                  }
                />
              </FormControl>
              <FormControl sx={{ width: '18%' }}>
                <TextField
                  id="outlined"
                  label="Транспортация"
                  type="number"
                  variant="outlined"
                  sx={{ width: '100%' }}
                  autoComplete="off"
                  value={item.transportationPrice}
                  onChange={(event) =>
                    setItem({
                      ...item,
                      transportationPrice: event.target.value,
                      basePrice:
                        +item.customsDuty +
                        +event.target.value +
                        +item.purchasePrice +
                        +item.otherExpenses,
                      basePricePerProduct:
                        (+item.customsDuty +
                          +event.target.value +
                          +item.purchasePrice +
                          +item.otherExpenses) /
                        +item.amount,
                    })
                  }
                />
              </FormControl>
              <FormControl sx={{ width: '19%' }}>
                <TextField
                  id="outlined"
                  label="Таможенная пошлина"
                  type="number"
                  variant="outlined"
                  sx={{ width: '100%' }}
                  autoComplete="off"
                  value={item.customsDuty}
                  onChange={(event) =>
                    setItem({
                      ...item,
                      customsDuty: event.target.value,
                      basePrice:
                        +event.target.value +
                        +item.transportationPrice +
                        +item.purchasePrice +
                        +item.otherExpenses,
                      basePricePerProduct:
                        (+event.target.value +
                          +item.transportationPrice +
                          +item.purchasePrice +
                          +item.otherExpenses) /
                        +item.amount,
                    })
                  }
                />
              </FormControl>
              <FormControl sx={{ width: '19%' }}>
                <TextField
                  id="outlined"
                  label="Другие расходы"
                  type="number"
                  variant="outlined"
                  sx={{ width: '100%' }}
                  autoComplete="off"
                  value={item.otherExpenses}
                  onChange={(event) =>
                    setItem({
                      ...item,
                      otherExpenses: event.target.value,
                      basePrice:
                        +item.customsDuty +
                        +item.transportationPrice +
                        +item.purchasePrice +
                        +event.target.value,
                      basePricePerProduct:
                        (+item.customsDuty +
                          +item.transportationPrice +
                          +item.purchasePrice +
                          +event.target.value) /
                        +item.amount,
                    })
                  }
                />
              </FormControl>
              <FormControl sx={{ width: '19%' }}>
                <TextField
                  id="outlined"
                  label="Общая себестоимость"
                  type="number"
                  variant="outlined"
                  sx={{ width: '100%' }}
                  autoComplete="off"
                  value={item.basePrice}
                  disabled
                />
              </FormControl>
              <FormControl sx={{ width: '19%' }}>
                <TextField
                  id="outlined"
                  label="Себестоимость 1 ед. товара"
                  type="number"
                  variant="outlined"
                  sx={{ width: '100%' }}
                  autoComplete="off"
                  value={item.basePricePerProduct}
                  disabled
                />
              </FormControl>
              <Button
                variant="contained"
                onClick={addItemHandler}
                // disabled={!validForm()}
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
                gap: '10px',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <FormControl sx={{ width: '24%' }}>
                <InputLabel id="demo-select-small-label">Поставщик</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  label="FinanceFilter"
                  value={operation.supplier}
                  onChange={(event) => setOperation({ ...operation, supplier: event.target.value })}
                >
                  <MenuItem value="">-</MenuItem>
                  {suppliers.map((supplier, index) => (
                    <MenuItem value={supplier._id} key={index}>
                      {supplier.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: '24%' }}>
                <InputLabel id="demo-select-small-label">Склад</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  label="StockFilter"
                  value={operation.stock}
                  onChange={(event) => setOperation({ ...operation, stock: event.target.value })}
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
                    });
                  }}
                />
              </FormControl>
              <FormControl sx={{ width: '24%' }}>
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
                    });
                  }}
                />
              </FormControl>

              <FormControl sx={{ width: '24%' }} size="medium">
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
                  onChange={(event) => setOperation({ ...operation, comment: event.target.value })}
                />
              </FormControl>

              <Button
                variant="contained"
                size="large"
                sx={{ width: '100%', margin: '0 auto' }}
                onClick={saveItemsHandler}
                disabled={!saveValidForm()}
              >
                Сохранить
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
