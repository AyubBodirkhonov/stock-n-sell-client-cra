import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Box, Card, Container, Divider, Grid, Stack, Typography } from '@mui/material';

import FormControl from '@mui/material/FormControl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import Iconify from '../../components/iconify';
import { useSettingsContext } from '../../components/settings';
import axios from '../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../utils/backend-error-handler';
import cashPng from '../../assets/backgound/cash-flow.png';
import returnPng from '../../assets/backgound/return.png';

export default function DailySellsReportPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [dailySellsReport, setDailySellsReport] = useState({});
  const [dailyPurchasesReport, setDailyPurchasesReport] = useState({});
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const dailySellsReportData = useCallback(async () => {
    try {
      const [dailySellsRes, dailyPurchasesRes] = await Promise.all([
        axios.get('/api/v1/report/general/daily-sells', {
          headers: { authorization: localStorage.getItem('accessToken') },
          params: {
            startDate: selectedStartDate,
            endDate: selectedEndDate,
          },
        }),
        axios.get('/api/v1/report/general/daily-purchase', {
          headers: { authorization: localStorage.getItem('accessToken') },
          params: {
            startDate: selectedStartDate,
            endDate: selectedEndDate,
          },
        }),
      ]);
      if (dailyPurchasesRes.data.success && dailySellsRes.data.success) {
        setDailySellsReport(dailySellsRes.data.data);
        setDailyPurchasesReport(dailyPurchasesRes.data.data);
      } else {
        enqueueSnackbar(
          SnackbarMessage.error[BackendErrorHandler(dailyPurchasesRes.data.error[0])],
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
  }, [enqueueSnackbar, selectedStartDate, selectedEndDate]);

  useEffect(() => {
    dailySellsReportData();
  }, [dailySellsReportData]);
  const clearFilter = () => {
    setSelectedStartDate('');
    setSelectedEndDate('');
  };

  return (
    <>
      <Helmet>
        <title>Отчет по касее</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Отчет по кассе</Typography>
        <Grid container spacing={2} mt={3}>
          <Grid item xs={12}>
            <Stack
              direction="row"
              spacing={2}
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
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                p: 3,
                gap: '10px',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '100%' }}
              >
                <Typography variant="h6" color="primary">
                  Касса продаж
                </Typography>
                <Box>
                  <img src={cashPng} alt="money png" />
                </Box>
              </Stack>

              <Divider width="100%" />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Наличные</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    ${dailySellsReport.cash?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Безналичные</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    ${dailySellsReport.noCash?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Прибыль</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: '#00AB55' }}>
                    ${dailySellsReport.profit?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Дебиторство</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    ${dailySellsReport.entitlement?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                p: 3,
                gap: '10px',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '100%' }}
              >
                <Typography variant="h6" color="primary">
                  Количественный отчет по продажам
                </Typography>
                <Box>
                  <img src={returnPng} alt="sales png" />
                </Box>
              </Stack>
              <Divider width="100%" />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Кол-во платежей</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {dailySellsReport.paymentsCount?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Кол-во проданных товаров</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {dailySellsReport.soldProductsCount?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Кол-во продаж (операций)</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {dailySellsReport.salesCount?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>

              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Сумма продаж (операций)</strong>
                </Typography>

                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {dailySellsReport.salesAmount?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                p: 3,
                gap: '10px',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '100%' }}
              >
                <Typography variant="h6" color="primary">
                  Касса покупок
                </Typography>
                <Box>
                  <img src={cashPng} alt="money png" />
                </Box>
              </Stack>

              <Divider width="100%" />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Наличные</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'error.main' }}>
                    ${dailyPurchasesReport.cash?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Безналичные</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'error.main' }}>
                    ${dailyPurchasesReport.noCash?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Кол-во закуп товаров</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {dailyPurchasesReport.purchasedProductsCount?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Сумма закупа</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    ${dailyPurchasesReport.purchaseAmount?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                p: 3,
                gap: '10px',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '100%' }}
              >
                <Typography variant="h6" color="primary">
                  Сальдо
                </Typography>
                <Box>
                  <img src={cashPng} alt="money png" />
                </Box>
              </Stack>

              <Divider width="100%" />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Наличные</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        dailySellsReport.cash - dailyPurchasesReport.cash > 0
                          ? '#00AB55'
                          : 'error.main',
                    }}
                  >
                    ${(dailySellsReport.cash - dailyPurchasesReport.cash)?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '600px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Безналичные</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        dailySellsReport.noCash - dailyPurchasesReport.noCash > 0
                          ? '#00AB55'
                          : 'error.main',
                    }}
                  >
                    ${(dailySellsReport.noCash - dailyPurchasesReport.noCash)?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
