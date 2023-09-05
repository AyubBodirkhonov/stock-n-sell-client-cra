import { useCallback, useEffect, useState } from 'react';
import { Container, Typography, Card, Stack, Box, Grid, Divider } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';

import cashPng from '../../assets/backgound/cash-flow.png';
import returnPng from '../../assets/backgound/return.png';
import allocationPng from '../../assets/backgound/allocation.png';

import axios from '../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../utils/backend-error-handler';
import { useSettingsContext } from '../../components/settings';

export default function PageCashier() {
  const { themeStretch } = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();
  const [dailySellsReport, setDailySellsReport] = useState({});
  const [entitleAndIndebtednessReport, setEntitleAndIndebtednessReport] = useState({});

  const getDictionaries = useCallback(async () => {
    try {
      const [dailySellsReportResponse, entitlementAndIndebtnessReportRes] = await Promise.all([
        axios.get('/api/v1/report/general/daily-sells'),
        axios.get('/api/v1/report/general/entitlement-indebtedness'),
      ]);

      if (dailySellsReportResponse.data.success && entitlementAndIndebtnessReportRes.data.success) {
        setDailySellsReport(dailySellsReportResponse.data.data);
        setEntitleAndIndebtednessReport(entitlementAndIndebtnessReportRes.data.data);
      } else {
        enqueueSnackbar(
          SnackbarMessage.error[BackendErrorHandler(dailySellsReportResponse.data.error[0])],
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
  }, [enqueueSnackbar]);

  useEffect(() => {
    getDictionaries();
  }, [getDictionaries]);

  return (
    <>
      <Helmet>
        <title>Касса</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3">Касса</Typography>

        <Grid container spacing={2} mt={5}>
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
                  Касса (сегодня)
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
                sx={{ width: { xs: '550px', xl: '700px' } }}
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
                sx={{ width: { xs: '550px', xl: '700px' } }}
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
                sx={{ width: { xs: '550px', xl: '700px' } }}
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
                sx={{ width: { xs: '550px', xl: '700px' } }}
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
              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '700px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Расходы</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'red' }}>
                    ${dailySellsReport.expensesAmount?.toLocaleString()}
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
                  Количественный отчет по продажам (Сегодня)
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
                sx={{ width: '700px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Кол-во расходов</strong>
                </Typography>

                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {dailySellsReport.expensesCount?.toLocaleString()}
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
                sx={{ width: { xs: '550px', xl: '700px' } }}
              >
                <Typography variant="h6" color="primary">
                  Дебиторство и Кредиторство
                </Typography>
                <Box>
                  <img src={allocationPng} alt="dept png" />
                </Box>
              </Stack>

              <Divider width="100%" />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '550px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Дебиторство</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    ${entitleAndIndebtednessReport.entitlement?.toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '550px', xl: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Кредиторство</strong>
                </Typography>
                <Stack sx={{ width: '250px' }}>
                  <Typography variant="body2" sx={{ color: 'red' }}>
                    ${entitleAndIndebtednessReport.indebtedness?.toLocaleString()}
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
