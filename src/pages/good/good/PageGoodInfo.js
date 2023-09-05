import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Container,
  Grid,
  Typography,
  Card,
  Divider,
  Stack,
  Modal,
  Box,
  InputLabel,
  Select,
  FormControl,
  TextField,
  MenuItem,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';

import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';

import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';
import { useSettingsContext } from '../../../components/settings';
import axios from '../../../utils/axios';
import { ConfirmDialog } from '../../../components/dialog/confirm-dialog';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function PageGoodInfo() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const [good, setGood] = useState({
    leftAmountInStock: [],
  });
  const [goodBasePrices, setGoodBasePrices] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [goodTransferHistory, setGoodTransferHistory] = useState([]);
  const [goodTransfer, setGoodTransfer] = useState({
    good: id,
    fromStock: '',
    toStock: '',
    amount: null,
  });

  const [displayOptions, setDisplayOptions] = useState({
    transfers: 'none',
    leftAmounts: 'none',
    basePrice: 'none',
  });

  const getDictionaries = useCallback(async () => {
    try {
      const [goodResponse, stocksResponse, goodBasePricesResponse, goodTransferHistoryResponse] =
        await Promise.all([
          axios.get(`/api/v1/good/${id}`, {
            headers: { authorization: localStorage.getItem('accessToken') },
          }),
          axios.get('/api/v1/stock', {
            headers: { authorization: localStorage.getItem('accessToken') },
          }),
          await axios.get(`/api/v1/good-base-price`, {
            headers: { authorization: localStorage.getItem('accessToken') },
            params: {
              good: id,
            },
          }),
          await axios.get(`/api/v1/good-transfer`, {
            headers: { authorization: localStorage.getItem('accessToken') },
            params: {
              good: id,
            },
          }),
        ]);

      if (
        goodResponse.data.success &&
        stocksResponse.data.success &&
        goodBasePricesResponse.data.success &&
        goodTransferHistoryResponse.data.success
      ) {
        setGood(goodResponse.data.data);
        setStocks(stocksResponse.data.data);
        setGoodBasePrices(goodBasePricesResponse.data.data);
        setGoodTransferHistory(goodTransferHistoryResponse.data.data);
      } else {
        enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(goodResponse.data.error[0])], {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  }, [id, enqueueSnackbar]);

  useEffect(() => {
    getDictionaries();
  }, [getDictionaries]);

  const transferGoodHandler = async () => {
    if (!validTransferForm()) {
      enqueueSnackbar(SnackbarMessage.error.invalidFields, { variant: SnackbarType.error });
    }

    try {
      const response = await axios.post('/api/v1/good/transfer', goodTransfer, {
        headers: {
          authorization: localStorage.getItem('accessToken'),
        },
      });

      if (response.data.success) {
        enqueueSnackbar(SnackbarMessage.success.goodTransferAdded);
        setTimeout(() => window.location.reload(), 700);
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

  const validTransferForm = () => {
    let valid = false;

    if (
      goodTransfer.toStock &&
      goodTransfer.fromStock &&
      goodTransfer.amount > 0 &&
      goodTransfer.fromStock !== goodTransfer.toStock
    ) {
      valid = true;
    }

    return valid;
  };

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // DIALOG
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Table styles >>>>>
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  return (
    <>
      <Helmet>
        <title>Товар инфо</title>
      </Helmet>

      <ConfirmDialog
        // action={''}
        open={openDialog}
        handleClose={handleCloseDialog}
        title="Удаление товара"
        description="Вы уверены что хотите удалить товар? При удаление товара могут возникнуть проблемы с операциями с участием этого товара! Проверьте еще раз на наличие операций, если операций нет, то всё хорошо"
      />

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Информация о товаре </Typography>
        <Stack direction="row" spacing={{ xs: 6, md: 2 }} justifyContent="flex-end">
          <Button variant="contained" size="small" sx={{ p: 2.5 }} onClick={handleOpen}>
            + Трансфер товара
          </Button>
        </Stack>
        <Grid container mt={2} spacing={2}>
          <Grid item xs={12}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                p: 3,
                gap: '10px',
              }}
            >
              <Typography variant="h6" color="primary">
                Базовая информация
              </Typography>
              <Divider width="100%" />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '700px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Наимнование</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {good.name}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '700px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Категория</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {good.category?.name}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '700px' }}
              >
                <Typography variant="subtitle2">
                  <strong>ID</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {good._id}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '700px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Дата добавления</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {HHmmDDMMYYYY(good.createdAt)}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '700px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Общее кол-во</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {good.leftAmount}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Stack
            direction="row"
            justifyContent="flex-end"
            mt={4}
            alignItems="center"
            sx={{ width: '100%' }}
          >
            <Box>
              <Button
                variant={displayOptions.leftAmounts === 'block' ? 'contained' : 'outlined'}
                size="small"
                color="secondary"
                sx={{ p: 2.5, marginLeft: 2 }}
                onClick={() =>
                  setDisplayOptions({
                    ...displayOptions,
                    leftAmounts: displayOptions.leftAmounts === 'none' ? 'block' : 'none',
                  })
                }
              >
                Остатки товара в складах
              </Button>
            </Box>
            <Box>
              <Button
                variant={displayOptions.transfers === 'block' ? 'contained' : 'outlined'}
                color="secondary"
                size="small"
                sx={{ p: 2.5, marginLeft: 2 }}
                onClick={() =>
                  setDisplayOptions({
                    ...displayOptions,
                    transfers: displayOptions.transfers === 'none' ? 'block' : 'none',
                  })
                }
              >
                История Трансферов товара
              </Button>
            </Box>
            <Box>
              <Button
                variant={displayOptions.basePrice === 'block' ? 'contained' : 'outlined'}
                color="secondary"
                size="small"
                sx={{ p: 2.5, marginLeft: 2 }}
                onClick={() =>
                  setDisplayOptions({
                    ...displayOptions,
                    basePrice: displayOptions.basePrice === 'none' ? 'block' : 'none',
                  })
                }
              >
                История Себестоимости товара
              </Button>
            </Box>
          </Stack>

          <Paper
            sx={{
              width: '100%',
              overflow: 'hidden',
              marginTop: '2rem',
              display: displayOptions.leftAmounts,
            }}
          >
            <TableContainer>
              <Table aria-label="customized table">
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell align="center">Склад</StyledTableCell>
                    <StyledTableCell align="center">Остаток</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {good.leftAmountInStock?.map((item, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">{item.stock?.name}</StyledTableCell>
                      <StyledTableCell align="center">{item.leftAmount}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Grid item xs={6}>
            <Paper
              sx={{
                width: '100%',
                overflow: 'hidden',
                marginTop: '2rem',
                display: displayOptions.transfers,
              }}
            >
              <TableContainer>
                <Table aria-label="customized table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center">Дата</StyledTableCell>
                      <StyledTableCell align="center">Со склада</StyledTableCell>
                      <StyledTableCell align="center">В Склад</StyledTableCell>
                      <StyledTableCell align="center">Кол-во</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {goodTransferHistory?.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">
                          {HHmmDDMMYYYY(item.createdAt)}
                        </StyledTableCell>
                        <StyledTableCell align="center">{item.fromStock?.name}</StyledTableCell>
                        <StyledTableCell align="center">{item.toStock?.name}</StyledTableCell>
                        <StyledTableCell align="center">{item.amount}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              sx={{
                width: '100%',
                overflow: 'hidden',
                marginTop: '2rem',
                display: displayOptions.basePrice,
              }}
            >
              <TableContainer>
                <Table aria-label="customized table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center">Дата покупки</StyledTableCell>
                      <StyledTableCell align="center">Себестоимость</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {goodBasePrices.map((basePrice) => (
                      <StyledTableRow key={basePrice?._id}>
                        <StyledTableCell align="center">
                          {HHmmDDMMYYYY(basePrice.createdAt)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {basePrice.basePrice?.toLocaleString()}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Трансфер товара - {good.name}
          </Typography>

          <Stack>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100 }}>
              <InputLabel id="demo-select-small-label">Со склада</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="GoodFilter"
                value={goodTransfer.fromStock}
                onChange={(event) =>
                  setGoodTransfer({ ...goodTransfer, fromStock: event.target.value })
                }
                sx={{ height: '60px' }}
              >
                {stocks.map((stock, index) => (
                  <MenuItem key={index} value={stock._id}>
                    {stock.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100 }}>
              <InputLabel id="demo-select-small-label">На склад</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="GoodFilter"
                value={goodTransfer.toStock}
                onChange={(event) =>
                  setGoodTransfer({ ...goodTransfer, toStock: event.target.value })
                }
                sx={{ height: '60px' }}
              >
                {stocks.map((stock, index) => (
                  <MenuItem key={index} value={stock._id}>
                    {stock.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Количество"
                variant="outlined"
                type="number"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={goodTransfer.amount}
                onChange={(event) =>
                  setGoodTransfer({ ...goodTransfer, amount: +event.target.value })
                }
              />
            </FormControl>
          </Stack>

          <Stack>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={!validTransferForm()}
              onClick={transferGoodHandler}
              sx={{ p: 2.5, m: 2 }}
            >
              Перенести
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
