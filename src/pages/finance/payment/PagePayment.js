import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
// @mui
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Iconify from '../../../components/iconify/Iconify';
import PaymentFilter from '../../../components/filter/payment.filter';
import { useSettingsContext } from '../../../components/settings';

import axios from '../../../utils/axios';
import { PlannedPaymentColor } from '../../../utils/dom';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';
import { SellOperationStatusRu } from '../../dictionary/sell-operation.dictionary';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import {
  PaymentStatusEnum,
  PaymentTypeEnum,
  PaymentTypeEnumRu,
  SpecPaymentTypeDict,
} from '../../dictionary/payment.dictionary';
import ExportToXlsx from '../../../utils/xlsx';

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

export default function Payment() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState(false);
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newPayment, setNewPayment] = useState({
    status: PaymentStatusEnum.conducted,
    cashAmount: null,
    noCashAmount: null,
    totallyPaid: null,
    createdAt: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [filterOption, setFilterOption] = useState({
    startDate: '',
    endDate: '',
    status: '',
    plannedStartDate: '',
    plannedEndDate: '',
    type: '',
  });

  const getDicts = useCallback(async () => {
    try {
      const [clientsRes, suppliersRes] = await Promise.all([
        axios.get('/api/v1/client', {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
        axios.get('/api/v1/supplier'),
        {
          headers: { authorization: localStorage.getItem('accessToken') },
        },
      ]);

      if (clientsRes.data.success && suppliersRes.data.success) {
        setClients(clientsRes.data.data);
        setSuppliers(suppliersRes.data.data);
      } else {
        enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(clientsRes.data.error[0])], {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  }, [enqueueSnackbar]);

  const paymentOperationData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/payment/', {
        params: {
          ...filterOption,
        },
        headers: { authorization: localStorage.getItem('accessToken') },
      });

      if (response.data.success) {
        setPayments(response.data.data);
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
  }, [enqueueSnackbar, filterOption]);

  const newPaymentHandler = async () => {
    setButtonDisabled(() => true);
    try {
      const resposne = await axios.post(
        '/api/v1/payment',
        {
          ...newPayment,
          cashAmount: +newPayment.cashAmount,
          noCashAmount: +newPayment.noCashAmount,
          totallyPaid: +newPayment.totallyPaid,
          supplier: newPayment.type === PaymentTypeEnum.creditPayOff ? newPayment.supplier : null,
          client: newPayment.type === PaymentTypeEnum.debitPayOff ? newPayment.client : null,
        },
        {
          headers: {
            authorization: localStorage.getItem('accessToken'),
          },
        }
      );

      if (resposne.data.success) {
        window.location.reload();
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  };

  useEffect(() => {
    paymentOperationData();
    getDicts();
  }, [paymentOperationData, getDicts]);

  const resetFilters = () => {
    setFilterOption({});
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validPayment = () =>
    (newPayment.supplier || newPayment.client) &&
    newPayment.type &&
    +newPayment.cashAmount >= 0 &&
    +newPayment.noCashAmount >= 0 &&
    +newPayment.totallyPaid > 0 &&
    !buttonDisabled;

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

  const exportXlsx = () => {
    const tableId = 'payments';
    ExportToXlsx(tableId, 'Отчет по платежам');
  };

  return (
    <>
      <Helmet>
        <title>Платежи</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Список платежей</Typography>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          justifyContent="flex-end"
          alignItems="center"
          mb={{ xs: 2, md: '5' }}
        >
          <Stack direction="row" spacing={{ xs: 6, md: 2 }} alignItems="center">
            <Button onClick={resetFilters}>
              <Iconify icon="pajamas:retry" />
            </Button>
            <Button
              variant={filters ? 'contained' : 'outlined'}
              color="secondary"
              size="small"
              sx={{ p: 2.5 }}
              onClick={() => setFilters(!filters)}
            >
              Филтры
            </Button>
            <Button variant="outlined" size="small" sx={{ p: 2.5 }} onClick={exportXlsx}>
              Excel
            </Button>
            <Button variant="contained" onClick={handleOpen}>
              + Добавить платеж
            </Button>
          </Stack>
        </Stack>
        <Stack direction="row" sx={{ mx: -3, display: !filters ? 'none' : 'block' }}>
          <PaymentFilter filterOption={filterOption} setFilterOption={setFilterOption} />
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table
              id="payments"
              sx={{ minWidth: 700, borderRadius: '16px' }}
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Тип</StyledTableCell>
                  <StyledTableCell align="center">Дата</StyledTableCell>
                  <StyledTableCell align="center">Запланирован</StyledTableCell>
                  <StyledTableCell align="center">Наличные</StyledTableCell>
                  <StyledTableCell align="center">Безналичные</StyledTableCell>
                  <StyledTableCell align="center">Статус</StyledTableCell>
                  <StyledTableCell align="center">Общая сумма</StyledTableCell>
                  <StyledTableCell align="center">Перейти</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* CONDUCTED OPERATIONS */}
                {TableItemsByPayments(payments)}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Новый платеж
          </Typography>

          <Stack>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <InputLabel id="demo-select-small-label">Тип платежа</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="FinanceFilter"
                value={newPayment.type}
                onChange={(event) => setNewPayment({ ...newPayment, type: event.target.value })}
              >
                {SpecPaymentTypeDict.map((type, index) => (
                  <MenuItem value={type.value} key={index}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              sx={{
                m: 1,
                ml: 2,
                minWidth: 100,
                minHeight: 50,
                display: newPayment.type === PaymentTypeEnum.debitPayOff ? 'none' : 'inherit',
              }}
              size="small"
            >
              <InputLabel id="demo-select-small-label">Поставщик</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="FinanceFilter"
                value={newPayment.supplier}
                onChange={(event) => setNewPayment({ ...newPayment, supplier: event.target.value })}
              >
                {suppliers.map((supplier, index) => (
                  <MenuItem value={supplier._id} key={index}>
                    {supplier.companyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              sx={{
                m: 1,
                ml: 2,
                minWidth: 100,
                minHeight: 50,
                display: newPayment.type === PaymentTypeEnum.creditPayOff ? 'none' : 'inherit',
              }}
              size="small"
            >
              <InputLabel id="demo-select-small-label">Клиент</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="FinanceFilter"
                value={newPayment.client}
                onChange={(event) => setNewPayment({ ...newPayment, client: event.target.value })}
              >
                {clients.map((client, index) => (
                  <MenuItem value={client._id} key={index}>
                    {client.companyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              sx={{
                m: 1,
                ml: 2,
                minWidth: 100,
                minHeight: 50,
              }}
              size="small"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']} sx={{ pt: 1 }}>
                  <DatePicker
                    inputFormat="DD/MM/YYYY"
                    label="Дата платежа:"
                    onChange={(date) => setNewPayment({ ...newPayment, createdAt: date })}
                    slotProps={{ textField: { size: 'small' } }}
                    sx={{ width: '100%' }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>

            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Наличные"
                type="number"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newPayment.cashAmount}
                onChange={(event) =>
                  setNewPayment({
                    ...newPayment,
                    cashAmount: +event.target.value,
                    totallyPaid: +event.target.value + +newPayment.noCashAmount,
                  })
                }
              />
            </FormControl>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Безналичные"
                type="number"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newPayment.noCashAmount}
                onChange={(event) =>
                  setNewPayment({
                    ...newPayment,
                    noCashAmount: +event.target.value,
                    totallyPaid: +event.target.value + +newPayment.cashAmount,
                  })
                }
              />
            </FormControl>
            <InputLabel id="demo-select-small-label" sx={{ marginLeft: 2 }}>
              Общая сумма
            </InputLabel>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                type="number"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newPayment.totallyPaid}
              />
            </FormControl>
          </Stack>

          <Stack>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={newPaymentHandler}
              disabled={!validPayment()}
              sx={{ p: 2.5, m: 2 }}
            >
              Сохранить
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

function TableItemsByPayments(payments) {
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

  /*
  payment.plannedOn !== payment.createdAt && LessThan3Days(payment.plannedOn)
            ? 'primary.main'
            : 'error.main',
  * */

  return payments.map((payment, idx) => (
    <StyledTableRow key={payment?._id}>
      <StyledTableCell align="center">
        <Button variant="outlined" size="small" color="secondary">
          {PaymentTypeEnumRu[payment.type?.toLowerCase()]}
        </Button>
      </StyledTableCell>
      <StyledTableCell align="center">{HHmmDDMMYYYY(payment.createdAt)}</StyledTableCell>
      <StyledTableCell
        align="center"
        sx={{
          color: PlannedPaymentColor(payment),
        }}
      >
        {/* eslint-disable-next-line no-nested-ternary */}
        {payment.plannedOn
          ? HHmmDDMMYYYY(payment.createdAt)?.split(' ')[1] ===
              HHmmDDMMYYYY(payment.plannedOn)?.split(' ')[1] &&
            payment.status === PaymentStatusEnum.conducted
            ? '<нет>'
            : HHmmDDMMYYYY(payment.plannedOn)
          : '<нет>'}
      </StyledTableCell>
      <StyledTableCell align="center">{payment.cashAmount?.toLocaleString()}</StyledTableCell>
      <StyledTableCell align="center">{payment.noCashAmount?.toLocaleString()}</StyledTableCell>

      <StyledTableCell align="center">
        <Button
          size="small"
          variant="outlined"
          color={
            // eslint-disable-next-line no-nested-ternary
            payment.status?.toLowerCase() === 'approved'
              ? 'secondary'
              : // eslint-disable-next-line no-nested-ternary
              payment.status?.toLowerCase() === 'conducted'
              ? 'primary'
              : payment.status?.toLowerCase() === 'cancelled'
              ? 'error'
              : 'warning'
          }
        >
          {SellOperationStatusRu[payment.status]}
          {payment.status?.toLowerCase() === 'pending' ? (
            <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />
          ) : (
            ''
          )}
        </Button>
      </StyledTableCell>
      <StyledTableCell align="center">{payment.totallyPaid?.toLocaleString()}</StyledTableCell>
      <StyledTableCell align="center">
        <Button
          href={
            payment.type === PaymentTypeEnum.sell
              ? `/dashboard/operation/sell-operation/${payment.sellOperation?._id}`
              : `/dashboard/operation/stock-operation/${payment.stockOperation?._id}`
          }
          variant="outlined"
          size="small"
          disabled={
            payment.type === PaymentTypeEnum.creditPayOff ||
            payment.type === PaymentTypeEnum.debitPayOff
          }
        >
          Операция
        </Button>
      </StyledTableCell>
    </StyledTableRow>
  ));
}
