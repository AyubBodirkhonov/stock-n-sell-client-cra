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

export default function StockOperationReport() {
  const { themeStretch } = useSettingsContext();
  const stockOperation = JSON.parse(localStorage.getItem('stock-operation'));

  setTimeout(() => {
    localStorage.removeItem('stock-operation');
  }, 7000);

  return (
    <>
      <Helmet>
        <title>Отчет</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box id="print-only">
          <Typography variant="h5" textAlign="center">
            Отчет по покупке товаров
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
                  Общая сумма покупки товара
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
                  Себестоимость товара
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
                  Цена покупки
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
                  Цена транспорта
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
                  Таможенная пошлина
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
                  Другие расходы
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockOperation.items.map((item, index) => (
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
                    ${item.basePrice?.toLocaleString()}
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
                    ${item.purchasePrice?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${item.transportationPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${item.customsDuty?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${item.otherExpenses?.toLocaleString()}
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
                <strong>Разгружен на склад</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  {stockOperation.stock?.name}
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
                <strong>Общая сумма покупки</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  ${stockOperation.totalPrice?.toLocaleString()}
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
                <strong>Первоначальная оплата наличными</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  ${stockOperation.paidInCash?.toLocaleString()}
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
                  ${stockOperation.paidInNoCash?.toLocaleString()}
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
                <strong>Оплаченная сумма</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  ${stockOperation.totallyPaid?.toLocaleString()}
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
                  ${stockOperation.leftToPay?.toLocaleString()}
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
                <strong>Дата создания операции</strong>
              </Typography>
              <Stack sx={{ width: '200px' }}>
                <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                  {HHmmDDMMYYYY(stockOperation.createdAt).split(' ')[1]}
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Grid container mt={5} justifyContent="center">
            <Grid item xs={6}>
              <Typography textAlign="center">Реквизиты нашей компании</Typography>
              <Typography textAlign="center">Подпись</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography textAlign="center">
                <strong>Поставщик</strong> - {stockOperation.supplier?.companyName}
              </Typography>
              <Typography textAlign="center">Подпись</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} mt={5}>
            <Typography sx={{ float: 'end' }}>
              <strong>Дата подписи: __/__/____ </strong>
            </Typography>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
