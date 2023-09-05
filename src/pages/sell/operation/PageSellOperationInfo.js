import { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
  Card,
} from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Icon } from '@iconify/react';
import IconButton from '@mui/material/IconButton';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSnackbar } from 'notistack';
import axios from '../../../utils/axios';
import { useSettingsContext } from '../../../components/settings';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';
import {
  SellOperationStatusEnum,
  SellOperationStatusRu,
} from '../../dictionary/sell-operation.dictionary';
import {
  PaymentStatusDict,
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '../../dictionary/payment.dictionary';
import { PlannedPaymentColor } from '../../../utils/dom';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
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

// import of images
function Row(props) {
  const { operation, sellOperationInfoData } = props;
  const [open, setOpen] = useState(true);

  useEffect(() => {
    sellOperationInfoData();
  }, [sellOperationInfoData]);

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
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell align="center">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <Icon icon="fe:arrow-up" /> : <Icon icon="fe:arrow-down" />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell align="center">{HHmmDDMMYYYY(operation.createdAt)}</StyledTableCell>
        <StyledTableCell component="th" scope="row" align="center">
          <Button
            variant="outlined"
            size="small"
            href={`/dashboard/dict/client/${operation.client?._id}`}
          >
            {operation.client?.companyName}
          </Button>
        </StyledTableCell>
        <StyledTableCell align="center">
          <Button
            size="small"
            variant="outlined"
            color={
              // eslint-disable-next-line no-nested-ternary
              operation.status?.toLowerCase() === 'planned'
                ? 'secondary'
                : // eslint-disable-next-line no-nested-ternary
                operation.status?.toLowerCase() === 'conducted'
                ? 'primary'
                : operation.status?.toLowerCase() === 'cancelled'
                ? 'error'
                : 'warning'
            }
          >
            {SellOperationStatusRu[operation.status]}
          </Button>
        </StyledTableCell>
        <StyledTableCell align="center">{operation.totalPrice?.toLocaleString()}</StyledTableCell>
        <StyledTableCell align="center">{operation.totallyPaid?.toLocaleString()}</StyledTableCell>
        <StyledTableCell align="center">{operation.paidInCash?.toLocaleString()}</StyledTableCell>
        <StyledTableCell align="center">{operation.paidInNoCash?.toLocaleString()}</StyledTableCell>
        <StyledTableCell
          align="center"
          sx={{
            color: operation.leftToPay > 0 ? 'secondary.main' : 'black',
          }}
        >
          {operation.leftToPay?.toLocaleString()}
        </StyledTableCell>
        <StyledTableCell
          align="center"
          sx={{ color: operation.profit > 0 ? 'primary.main' : 'error.main' }}
        >
          {operation.profit?.toLocaleString()}
        </StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 1, paddingTop: 2 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div" mt={4}>
                Товары
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell component="th" scope="row" align="center">
                      Товар
                    </TableCell>
                    <TableCell align="center">Кол-во</TableCell>
                    <TableCell align="center">Себестоимость</TableCell>
                    <TableCell align="center">Продано по цене</TableCell>
                    <TableCell align="center">Сумма</TableCell>
                    <TableCell align="center">Прибыль от товара</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody spacing={2}>
                  {operation.items?.map((item, index) => (
                    <TableRow key={index}>
                      <StyledTableCell align="center">{item.good?.name}</StyledTableCell>
                      <StyledTableCell align="center">
                        {item.amount?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.basePricePerProduct?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.pricePerProduct?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.itemTotalPrice?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {(
                          (item.pricePerProduct - item.basePricePerProduct) *
                          item.amount
                        ).toLocaleString()}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  operation: PropTypes.any, // Define prop type for setFilterOption
  sellOperationInfoData: PropTypes.func,
};

// PAGE SELL OPERATION MAIN FUNCTION PART -----------------------------------------------------------------------------

export default function PageSellOperationInfo() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [operation, setOperation] = useState({});
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    type: PaymentTypeEnum.sell,
    status: '',
    cashAmount: 0,
    noCashAmount: 0,
    totallyPaid: 0,
    sellOperation: id,
    createdAt: '',
  });

  /* FOR MODAL */

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const sellOperationInfoData = useCallback(async () => {
    const response = await axios.get(`/api/v1/sell-operation/${id}`, {
      headers: { authorization: localStorage.getItem('accessToken') },
    });

    if (response.data.success) {
      setOperation(response.data.data);
    } else {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(response.data.error[0])], {
        variant: SnackbarType.error,
      });
    }
  }, [id, enqueueSnackbar]);

  const getPayments = useCallback(async () => {
    const response = await axios.get('/api/v1/payment', {
      headers: { authorization: localStorage.getItem('accessToken') },
      params: { sellOperation: id },
    });

    if (response.data.success) {
      setPayments(response.data.data);
    } else {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(response.data.error[0])], {
        variant: SnackbarType.error,
      });
    }
  }, [enqueueSnackbar, id]);

  const addNewPayment = async () => {
    try {
      if (!validPayment()) {
        enqueueSnackbar(SnackbarMessage.error.invalidFields, {
          variant: SnackbarType.error,
        });
      } else {
        const paymentRes = await axios.post(
          '/api/v1/payment',
          {
            ...newPayment,
            cashAmount: +newPayment.cashAmount,
            noCashAmount: +newPayment.noCashAmount,
            totallyPaid: +newPayment.totallyPaid,
            plannedOn:
              newPayment.status === PaymentStatusEnum.planned ? newPayment.plannedOn : null,
          },
          {
            headers: { authorization: localStorage.getItem('accessToken') },
          }
        );

        if (paymentRes.data.success) {
          enqueueSnackbar(SnackbarMessage.success.paymentAdded, {
            variant: SnackbarType.success,
          });
          setTimeout(() => window.location.reload(), 200);
        } else {
          enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(paymentRes.data.error[0])], {
            variant: SnackbarType.error,
          });
        }
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  };

  const changePaymentStatus = async (paymentId, status) => {
    try {
      const response = await axios.patch(
        `/api/v1/payment/${paymentId}`,
        { status },
        {
          headers: { authorization: localStorage.getItem('accessToken') },
        }
      );

      if (response.data.success) {
        window.location.reload();
      } else {
        enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(response.data.error[0])], {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const validPayment = () =>
    newPayment.status &&
    +newPayment.cashAmount >= 0 &&
    +newPayment.noCashAmount >= 0 &&
    +newPayment.totallyPaid > 0;

  useEffect(() => {
    sellOperationInfoData();
    getPayments();
  }, [sellOperationInfoData, getPayments]);

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

  const formReportHandler = () => {
    localStorage.setItem('sell-operation', JSON.stringify(operation));
    window.location.href = '/dashboard/report-temp/sell-operation';
  };

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" mb={4}>
          Список продаж
        </Typography>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          justifyContent="flex-end"
          alignItems="center"
          mb={{ xs: 2, md: '2' }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1}
            justifyContent="flex-end"
            alignItems="center"
            mb={{ xs: 2, md: '2' }}
          >
            <Button color="secondary" variant="contained" onClick={formReportHandler}>
              Печать
            </Button>
            <Button variant="contained" onClick={handleOpen}>
              + Добавить платеж
            </Button>
          </Stack>
        </Stack>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center">Инфо</StyledTableCell>
                <StyledTableCell align="center">Дата</StyledTableCell>
                <StyledTableCell align="center">Клиент</StyledTableCell>
                <StyledTableCell align="center">Статус</StyledTableCell>
                <StyledTableCell align="center">Общая сумма</StyledTableCell>
                <StyledTableCell align="center">Заплачено в общем</StyledTableCell>
                <StyledTableCell align="center">Заплачено наличными</StyledTableCell>
                <StyledTableCell align="center">Заплачено безналичные</StyledTableCell>
                <StyledTableCell align="center">Осталось заплатить</StyledTableCell>
                <StyledTableCell align="center">Общая прибыль</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              <Row
                operation={operation}
                setOperation={setOperation}
                sellOperationInfoData={sellOperationInfoData}
              />
            </TableBody>
          </Table>
        </TableContainer>

        {/* COMMENTS ------------------------------------------------------------------------------------------*/}

        <Card sx={{ p: 2, marginTop: '20px' }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ width: '90%' }}
          >
            <Typography variant="h7">
              <strong>Дополнительно:</strong>
            </Typography>
            <Typography
              variant="subtitle"
              sx={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
            >
              {operation.comment ? operation.comment : '<пусто>'}
            </Typography>
          </Stack>
        </Card>

        {/* PAYMENTS ------------------------------------------------------------------------------------------*/}

        <Typography variant="h6" gutterBottom component="div" mt={4}>
          Платежи
        </Typography>
        <TableContainer>
          <Table sx={{ minWidth: 700, borderRadius: '16px' }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Дата</StyledTableCell>
                <StyledTableCell align="center">Дата платежа (запланированные)</StyledTableCell>
                <StyledTableCell align="center">Статус</StyledTableCell>
                <StyledTableCell align="center">Наличные</StyledTableCell>
                <StyledTableCell align="center">Безналичные</StyledTableCell>
                <StyledTableCell align="center">Общая сумма</StyledTableCell>
                <StyledTableCell align="center">Действия</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <StyledTableRow key={payment?._id}>
                  <StyledTableCell align="center">
                    {HHmmDDMMYYYY(payment.createdAt)}
                  </StyledTableCell>
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
                  <StyledTableCell align="center">
                    <Button
                      size="small"
                      variant="outlined"
                      color={
                        // eslint-disable-next-line no-nested-ternary
                        payment.status.toLowerCase() === 'planned'
                          ? 'secondary'
                          : // eslint-disable-next-line no-nested-ternary
                          payment.status.toLowerCase() === 'conducted'
                          ? 'primary'
                          : payment.status.toLowerCase() === 'cancelled'
                          ? 'error'
                          : 'warning'
                      }
                    >
                      {SellOperationStatusRu[payment.status]}
                    </Button>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {payment.cashAmount?.toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {payment.noCashAmount?.toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {payment.totallyPaid?.toLocaleString()}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Stack direction={{ md: 'column', lg: 'row' }} alignItems="center" spacing={2}>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        disabled={
                          payment.status === SellOperationStatusEnum.conducted ||
                          payment.status === SellOperationStatusEnum.cancelled
                        }
                        onClick={() =>
                          changePaymentStatus(payment._id, SellOperationStatusEnum.cancelled)
                        }
                      >
                        Отменить
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          changePaymentStatus(payment._id, SellOperationStatusEnum.conducted)
                        }
                        disabled={
                          payment.status === SellOperationStatusEnum.conducted ||
                          payment.status === SellOperationStatusEnum.cancelled
                        }
                      >
                        Провести
                      </Button>
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
                value={newPayment.status}
                onChange={(event) => setNewPayment({ ...newPayment, status: event.target.value })}
              >
                {PaymentStatusDict.map((status, index) => (
                  <MenuItem value={status.value} key={index}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              sx={{
                display: newPayment.status === PaymentStatusEnum.planned ? 'inherit' : 'none',
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
                    label="Дата запланированного платежа:"
                    onChange={(date) => setNewPayment({ ...newPayment, plannedOn: date })}
                    slotProps={{ textField: { size: 'small' } }}
                    sx={{ width: '100%' }}
                  />
                </DemoContainer>
              </LocalizationProvider>
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
                    cashAmount: event.target.value,
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
                    noCashAmount: event.target.value,
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
              onClick={addNewPayment}
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
