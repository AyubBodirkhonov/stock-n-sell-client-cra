import { Container, Grid, Typography, Button, Box, Card, Divider, Stack } from '@mui/material';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Helmet } from 'react-helmet-async';

import { useSettingsContext } from '../../../components/settings';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';

import './sell-operation.report.css';

export default function SellOperationReport() {
  const { themeStretch } = useSettingsContext();
  const sellOperation = JSON.parse(localStorage.getItem('sell-operation'));

  setTimeout(() => {
    localStorage.removeItem('sell-operation');
  }, 7000);

  return (
    <>
      <Helmet>
        <title>Отчет</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box id="print-only">
          <Typography variant="h5" textAlign="center">
            Отчет по продаже товаров
          </Typography>

          <Typography style={{ marginTop: '15px' }}>
            <strong>Номер инвойса:</strong> #{sellOperation.invoiceCount}
          </Typography>

          <Table style={{ borderCollapse: 'collapse', marginTop: '5px' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fff' }}>
                <TableCell
                  align="center"
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                >
                  Товар
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                >
                  Кол-во
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                >
                  Себестоимость
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                >
                  Цена
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                >
                  Общая сумма
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellOperation.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    {item.good?.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    {item.amount?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${item.basePricePerProduct?.toLocaleString()}
                  </TableCell>

                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${item.pricePerProduct?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${item.itemTotalPrice?.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 3,
              gap: '10px',
            }}
          >
            <Typography variant="h6">Дополнительная информация</Typography>
            <Divider width="100%" />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: '700px' }}
            >
              <Typography variant="subtitle2">
                <strong>Первоначальная оплата наличными</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  ${sellOperation.paidInCash?.toLocaleString()}
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
                <strong>Первоначальная оплата безнал</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  ${sellOperation.paidInNoCash?.toLocaleString()}
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
                <strong>Остаток платежа</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  ${sellOperation.leftToPay?.toLocaleString()}
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
                <strong>Прибыль</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  ${sellOperation.profit?.toLocaleString()}
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
                <strong>Сумма продажи</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  ${sellOperation.totalPrice?.toLocaleString()}
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
                <strong>Оплачено</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  ${sellOperation.totallyPaid?.toLocaleString()}
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
                <strong>Дата создания</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  {HHmmDDMMYYYY(sellOperation.createdAt).split(' ')[1]}
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Grid container mt={5} justifyContent="center">
            <Grid item xs={6}>
              <Typography textAlign="center">Наши реквизиты</Typography>
              <Typography textAlign="center">Подпись</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography textAlign="center">
                <strong>Клиент</strong> - {sellOperation.client?.companyName}
              </Typography>
              <Typography textAlign="center">Подпись</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} mt={5}>
            <Typography>
              <strong>Дата подписи: __/__/____ </strong>
            </Typography>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
