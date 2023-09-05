import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, Container, Divider, Grid, Stack, Typography, Box } from '@mui/material';

import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FormControl from '@mui/material/FormControl';
import { useSnackbar } from 'notistack';
import Iconify from '../../components/iconify';
import { formatDate } from '../../utils/formatTime';
import axios from '../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../utils/backend-error-handler';
import { useSettingsContext } from '../../components/settings';
import ExportToXlsx from '../../utils/xlsx';

export default function GoodSellsReportPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [goodSellReports, setGoodSellReports] = useState([]);
  const [totalRates, setTotalRates] = useState({
    totalSoldAmount: 0,
    totalProfit: 0,
  });

  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const goodSellReportData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/report/general/sell-by-good', {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          startDate: selectedStartDate,
          endDate: selectedEndDate,
        },
      });
      if (response.data.success) {
        setGoodSellReports(response.data.data);
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

  const calculateTotalRates = (report) => {
    let totalSoldAmount = 0;
    let totalProfit = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const item of report) {
      totalSoldAmount += item.soldAmount;
      totalProfit += item.profitByGood;

      setTotalRates({
        totalSoldAmount,
        totalProfit,
      });
    }
  };

  const clearFilter = () => {
    setSelectedStartDate('');
    setSelectedEndDate('');
  };

  const formReportHandler = () => {
    localStorage.setItem(
      'good-sell',
      JSON.stringify({ goodSellReports, selectedEndDate, selectedStartDate })
    );
    window.location.href = '/dashboard/report-temp/good-sell';
  };

  useEffect(() => {
    goodSellReportData();
  }, [goodSellReportData]);

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

  const [displayTotals, setDisplayTotals] = useState('none');

  const totalStatsDisplayHandler = () => {
    setDisplayTotals(displayTotals !== 'none' ? 'none' : 'flex');
  };

  const exportXlsx = () => {
    const tableId = 'report-good-sell';
    ExportToXlsx(tableId, 'Отчет по продаже товаров');
  };

  return (
    <>
      <Helmet>
        <title>Отчет по продаже товаров</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h4">Отчет по продаже товаров</Typography>
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
                sx={{ width: '600px' }}
              >
                <Typography variant="subtitle2">
                  <strong>С:</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
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
                sx={{ width: '600px' }}
              >
                <Typography variant="subtitle2">
                  <strong>По:</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {selectedEndDate ? formatDate(selectedEndDate) : 'Выберите дату'}
                  </Typography>
                </Stack>
              </Stack>

              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '600px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Продано товаров за период:</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {totalRates.totalSoldAmount.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>

              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '600px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Получено прибыли за период:</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {totalRates.totalProfit.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          {/* TABLE REPORT */}

          <Grid item xs={12}>
            <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '2rem' }}>
              <TableContainer>
                <Table id="report-good-sell" aria-label="customized table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center">Товар</StyledTableCell>
                      <StyledTableCell align="center">Кол-во</StyledTableCell>
                      <StyledTableCell align="center">Кол-во операций</StyledTableCell>
                      <StyledTableCell align="center">Прибыль</StyledTableCell>
                      <StyledTableCell align="center">
                        Средняя себестоимость (за ед. товара)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Средняя цена продажи (за ед. товара)
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Средняя прибыль (за ед. товара)
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {goodSellReports.map((report, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">{report.good?.name}</StyledTableCell>
                        <StyledTableCell align="center">
                          {report.soldAmount?.toLocaleString()}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          {report.operationWithGoodCount?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.profitByGood?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.averageBasePriceOnSellOperations?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.averageSoldPriceByOperation?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {report.averageProfitByGood?.toLocaleString()}
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
