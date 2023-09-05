import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, Container, Divider, Grid, Stack, Typography } from '@mui/material';

import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import FormControl from '@mui/material/FormControl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSnackbar } from 'notistack';
import Button from '@mui/material/Button';
import Iconify from '../../components/iconify';
import axios from '../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../utils/backend-error-handler';
import { useSettingsContext } from '../../components/settings';
import { formatDate } from '../../utils/formatTime';
import ExportToXlsx from '../../utils/xlsx';

export default function GoodPurchaseReportPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [purchaseReports, setPurchaseReports] = useState([]);
  const [totalRates, setTotalRates] = useState({
    totalPurchasePrice: 0,
    totalTransportationPrice: 0,
    totalCustomsDutyPrice: 0,
    totalOtherExpensePrice: 0,
  });

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const purchaseReportData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/report/general/purchase-by-good', {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          startDate: selectedStartDate,
          endDate: selectedEndDate,
        },
      });
      if (response.data.success) {
        setPurchaseReports(response.data.data);
        calculateTotalRates(response.data.data);
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
  }, [enqueueSnackbar, selectedStartDate, selectedEndDate]);

  useEffect(() => {
    purchaseReportData();
  }, [purchaseReportData]);

  const calculateTotalRates = (report) => {
    let totalPurchasePrice = 0;
    let totalTransportationPrice = 0;
    let totalCustomsDutyPrice = 0;
    let totalOtherExpensePrice = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const item of report) {
      totalPurchasePrice += item.totalPurchasedGoodExpensesPrice;
      totalTransportationPrice += item.totalTransportationExpensesPrice;
      totalCustomsDutyPrice += item.totalCustomDutyExpensesPrice;
      totalOtherExpensePrice += item.totalOtherExpensesPrice;

      setTotalRates({
        totalPurchasePrice,
        totalTransportationPrice,
        totalCustomsDutyPrice,
        totalOtherExpensePrice,
      });
    }
  };
  const clearFilter = () => {
    setSelectedStartDate('');
    setSelectedEndDate('');
  };

  const formReportHandler = () => {
    localStorage.setItem(
      'purchase-good',
      JSON.stringify({ purchaseReports, selectedEndDate, selectedStartDate })
    );
    window.location.href = '/dashboard/report-temp/purchase-good';
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

  const exportXlsx = () => {
    const tableId = 'report-good-purchase';
    ExportToXlsx(tableId, 'Отчет по покупке товаров');
  };

  const [displayTotals, setDisplayTotals] = useState('none');

  const totalStatsDisplayHandler = () => {
    setDisplayTotals(displayTotals !== 'none' ? 'none' : 'flex');
  };

  return (
    <>
      <Helmet>
        <title>Отчет по закупу товаров</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h4">Отчет по закупу товаров</Typography>
        </Stack>
        <Grid container>
          <Stack
            direction="row"
            spacing={2}
            my={3}
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Stack spacing={2} direction="row">
              {' '}
              <FormControl sx={{ width: '40%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="С:"
                    slotProps={{ textField: { size: 'small' } }}
                    value={selectedStartDate}
                    onChange={(date) => setSelectedStartDate(date)}
                  />
                </LocalizationProvider>
              </FormControl>
              <FormControl sx={{ width: '40%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Пo:"
                    slotProps={{ textField: { size: 'small' } }}
                    value={selectedEndDate}
                    onChange={(date) => setSelectedEndDate(date)}
                  />
                </LocalizationProvider>
              </FormControl>
              <Button
                onClick={() => {
                  clearFilter();
                }}
              >
                <Iconify icon="pajamas:retry" />
              </Button>
            </Stack>

            <Stack direction="row">
              <Button
                variant={displayTotals === 'none' ? 'outlined' : 'contained'}
                color="warning"
                size="small"
                sx={{ p: 2.5, mr: 2 }}
                onClick={totalStatsDisplayHandler}
              >
                {displayTotals === 'none' ? 'Показать' : 'Скрыть'} суммарные данные
              </Button>
              <Button variant="outlined" size="small" sx={{ p: 2.5, mr: 2 }} onClick={exportXlsx}>
                Excel
              </Button>
              <Button variant="contained" color="secondary" onClick={formReportHandler}>
                Печать
              </Button>
            </Stack>
          </Stack>
          <Grid item xs={12}>
            <Card
              sx={{
                display: displayTotals,
                alignItems: 'flex-start',
                flexDirection: 'column',
                p: 3,
                gap: '10px',
              }}
            >
              <Typography variant="h6" color="primary">
                Суммарная информация
              </Typography>
              <Divider width="100%" />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '700px' }}
              >
                <Typography variant="subtitle2">
                  <strong>С:</strong>
                </Typography>
                <Stack sx={{ width: '200px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {selectedStartDate ? formatDate(selectedStartDate) : 'Выберите дату'}
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
                  <strong>По:</strong>
                </Typography>
                <Stack sx={{ width: '200px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {selectedStartDate ? formatDate(selectedEndDate) : 'Выберите дату'}
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
                  <strong>Общая сумма закупа за период:</strong>
                </Typography>
                <Stack sx={{ width: '200px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {totalRates.totalPurchasePrice.toLocaleString()}
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
                  <strong>Общая сумма транспортации за период:</strong>
                </Typography>
                <Stack sx={{ width: '200px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {totalRates.totalTransportationPrice.toLocaleString()}
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
                  <strong>Общая сумма таможеной пошлины за период:</strong>
                </Typography>
                <Stack sx={{ width: '200px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {totalRates.totalCustomsDutyPrice.toLocaleString()}
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
                  <strong>Общая сумма других расходов за период:</strong>
                </Typography>
                <Stack sx={{ width: '200px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {totalRates.totalOtherExpensePrice.toLocaleString()}
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
                  <strong>Общая сумма всех расходов за период:</strong>
                </Typography>
                <Stack sx={{ width: '200px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    <strong>
                      {(
                        totalRates.totalPurchasePrice +
                        totalRates.totalOtherExpensePrice +
                        totalRates.totalTransportationPrice +
                        totalRates.totalOtherExpensePrice +
                        totalRates.totalCustomsDutyPrice
                      ).toLocaleString()}
                    </strong>
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          {/* TABLE REPORT */}

          <Grid item xs={12}>
            <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '2rem' }}>
              <TableContainer>
                <Table id="report-good-purchase" aria-label="customized table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center">Товар</StyledTableCell>
                      <StyledTableCell align="center">Кол-во</StyledTableCell>
                      <StyledTableCell align="center">Кол-во операций</StyledTableCell>
                      <StyledTableCell align="center">
                        Общая сумма закупа (за период)
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        Общая сумма тарнспортации (за период)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Общая сумма там. пошлины (за период)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Общая сумма др. расходов (за период)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Сред. себестоимость (за ед. товара)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Сред. цена закупа (за ед. товара)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Сред. сумма транспортации (за ед. товара)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Сред. там. пошлина (за ед. товара)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Сред. сумма др. расходов (за ед. товара)
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseReports.map((report, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">{report.good?.name}</StyledTableCell>
                        <StyledTableCell align="center">
                          {report.purchasedAmount?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.operationWithGoodCount?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.totalPurchasedGoodExpensesPrice?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.totalTransportationExpensesPrice?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.totalCustomDutyExpensesPrice?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.totalOtherExpensesPrice?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.averageBasePriceOnPurchasesPerGood?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.averagePurchasesPricePerGood?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.averageTransportsPricePerGood?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.averageCustomsDutiesPricePerGood?.toLocaleString()}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          {report.averageOtherExpensesPricePerGood?.toLocaleString()}
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
    </>
  );
}
