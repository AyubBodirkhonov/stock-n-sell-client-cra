import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
} from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import { Icon } from '@iconify/react';
import IconButton from '@mui/material/IconButton';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  SellOperationStatusEnum,
  SellOperationStatusRu,
} from '../../dictionary/sell-operation.dictionary';
import axios from '../../../utils/axios';
import { useSettingsContext } from '../../../components/settings';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import { ConfirmDialog } from '../../../components/dialog/confirm-dialog';
import {
  PaymentStatusDict,
  PaymentStatusEnum,
  PaymentTypeEnum,
} from '../../dictionary/payment.dictionary';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';
import { PlannedPaymentColor } from '../../../utils/dom';
// import of images

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

function Row(props) {
  const { stockOperation, stockOperationInfoData } = props;
  const [open, setOpen] = useState(true);

  useEffect(() => {
    stockOperationInfoData();
  }, [stockOperationInfoData]);

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
        <StyledTableCell align="center">{HHmmDDMMYYYY(stockOperation.createdAt)}</StyledTableCell>
        <StyledTableCell align="center">
          {stockOperation.stock?.name?.toLocaleString()}
        </StyledTableCell>
        <StyledTableCell align="center">
          <Button
            variant="outlined"
            size="small"
            href={`/dashboard/dict/supplier/${stockOperation.supplier?._id}`}
          >
            {stockOperation.supplier?.companyName}
          </Button>
        </StyledTableCell>
        <StyledTableCell align="center">
          <Button
            size="small"
            variant="outlined"
            color={
              // eslint-disable-next-line no-nested-ternary
              stockOperation.status?.toLowerCase() === 'planned'
                ? 'secondary'
                : // eslint-disable-next-line no-nested-ternary
                stockOperation.status?.toLowerCase() === 'conducted'
                ? 'primary'
                : stockOperation.status?.toLowerCase() === 'cancelled'
                ? 'error'
                : 'warning'
            }
          >
            {SellOperationStatusRu[stockOperation.status]}
          </Button>
        </StyledTableCell>

        <StyledTableCell align="center">
          {stockOperation.totalPrice?.toLocaleString()}
        </StyledTableCell>
        <StyledTableCell align="center">
          {stockOperation.paidInCash?.toLocaleString()}
        </StyledTableCell>
        <StyledTableCell align="center">
          {stockOperation.paidInNoCash?.toLocaleString()}
        </StyledTableCell>
        <StyledTableCell align="center">
          {stockOperation.totallyPaid?.toLocaleString()}
        </StyledTableCell>
        <StyledTableCell
          align="center"
          sx={{
            color: stockOperation.leftToPay > 0 ? 'secondary.main' : 'black',
          }}
        >
          {stockOperation.leftToPay?.toLocaleString()}
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
                    <TableCell component="th" scope="row" align="center">
                      Товарная категория
                    </TableCell>
                    <TableCell align="center">Кол-во</TableCell>
                    <TableCell align="center">Общая себестоимость</TableCell>
                    <TableCell align="center">Себестоимость продукта</TableCell>
                    <TableCell align="center">Сумма покупки</TableCell>
                    <TableCell align="center">Сумма транспортации</TableCell>
                    <TableCell align="center">Сумма таможенной пошлины</TableCell>
                    <TableCell align="center">Другие расходы</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody spacing={2}>
                  {stockOperation.items?.map((item, index) => (
                    <TableRow key={index}>
                      <StyledTableCell align="center">{item.good?.name}</StyledTableCell>
                      <StyledTableCell align="center">{item.good?.category?.name}</StyledTableCell>
                      <StyledTableCell align="center">
                        {item.amount?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.basePrice?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.basePricePerProduct?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {item.purchasePrice?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ color: 'red' }}>
                        {item.transportationPrice?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ color: 'red' }}>
                        {item.customsDuty?.toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ color: 'red' }}>
                        {item.otherExpenses?.toLocaleString()}
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
  stockOperation: PropTypes.any, // Define prop type for setFilterOption
  stockOperationInfoData: PropTypes.func,
};

export default function PageStockOperationInfo() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const navigate = useNavigate();

  const [stockOperation, setStockOperation] = useState({});
  const [payments, setPayments] = useState([]);
  const [newPayment, setNewPayment] = useState({
    type: PaymentTypeEnum.buy,
    status: '',
    cashAmount: 0,
    noCashAmount: 0,
    totallyPaid: 0,
    stockOperation: id,
  });

  const stockOperationInfoData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/stock-operation/${id}`, {
        headers: { authorization: localStorage.getItem('accessToken') },
      });

      if (response.data.success) {
        setStockOperation(response.data.data);
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
  }, [id, enqueueSnackbar]);

  const operationPayments = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/payment', {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          stockOperation: id,
        },
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
  }, [id, enqueueSnackbar]);

  const changeStatusHandler = async () => {
    try {
      const changeStatusResponse = await axios.patch(
        `/api/v1/stock-operation/${id}`,
        {
          status: SellOperationStatusEnum.conducted,
        },
        {
          headers: { authorization: localStorage.getItem('accessToken') },
        }
      );

      if (changeStatusResponse.data.success) {
        window.location.reload();
      } else {
        enqueueSnackbar(
          SnackbarMessage.error[BackendErrorHandler(changeStatusResponse.data.error[0])],
          {
            variant: SnackbarType.error,
          }
        );
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  };

  /* PAYMENTS */
  const getPayments = useCallback(async () => {
    const response = await axios.get('/api/v1/payment', {
      headers: { authorization: localStorage.getItem('accessToken') },
      params: { stockOperation: id },
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
    stockOperationInfoData();
    operationPayments();
    getPayments();
  }, [stockOperationInfoData, operationPayments, getPayments]);

  // confirm dialog
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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

  // MODAL PAYMENT
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  /* REPORT TEMPLATE */
  const formReportHandler = () => {
    localStorage.setItem('stock-operation', JSON.stringify(stockOperation));
    window.location.href = '/dashboard/report-temp/stock-operation';
  };

  return (
    <>
      <Helmet>
        <title>Склад операции</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Список склад операций</Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          justifyContent="flex-end"
          alignItems="center"
          mb={{ xs: 2, md: '2' }}
        >
          <Button
            sx={{ float: 'right', width: '200px' }}
            variant="outlined"
            size="medium"
            color="warning"
            disabled={stockOperation.status === SellOperationStatusEnum.conducted}
            onClick={handleClickOpen}
          >
            Провести операцию
          </Button>
          <Button color="secondary" variant="contained" onClick={formReportHandler}>
            Печать
          </Button>
          <Button variant="contained" onClick={handleOpenModal}>
            + Добавить платеж
          </Button>
        </Stack>

        {/* confirmation dialog */}
        <ConfirmDialog
          title="Провести операцию"
          description="Проведение операции означает что все указанные данные в таблицах верны. При проведении
            операции значения остатков на складе будут обнавлены."
          action={changeStatusHandler}
          open={open}
          handleClose={handleClose}
        />

        <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
          <Table aria-label="collapsible table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="center">Инфо</StyledTableCell>
                <StyledTableCell align="center">Дата</StyledTableCell>
                <StyledTableCell align="center">Склад</StyledTableCell>
                <StyledTableCell align="center">Поставщик</StyledTableCell>
                <StyledTableCell align="center">Статус</StyledTableCell>
                <StyledTableCell align="center">Общая сумма закупа</StyledTableCell>
                <StyledTableCell align="center">Заплачено наличными</StyledTableCell>
                <StyledTableCell align="center">Заплачено безналичные</StyledTableCell>
                <StyledTableCell align="center">Заплачено в общем</StyledTableCell>
                <StyledTableCell align="center">Осталось заплатить</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              <Row
                stockOperation={stockOperation}
                setStockOperation={setStockOperation}
                stockOperationInfoData={stockOperationInfoData}
              />
            </TableBody>
          </Table>
        </TableContainer>

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
                    {HHmmDDMMYYYY(payment.createdAt)?.split(' ')[1] ===
                      HHmmDDMMYYYY(payment.plannedOn)?.split(' ')[1] &&
                    payment.status === PaymentStatusEnum.conducted
                      ? '<нет>'
                      : HHmmDDMMYYYY(payment.plannedOn)}
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
                      sx={{ marginLeft: 2 }}
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
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
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
                    label="С:"
                    onChange={(date) => setNewPayment({ ...newPayment, plannedOn: date })}
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
            <InputLabel id="demo-select-small-label">Общая сумма</InputLabel>
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
