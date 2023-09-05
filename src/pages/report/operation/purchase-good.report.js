import { Box, Container, Divider, Grid, Stack, Typography } from '@mui/material';

import { Helmet } from 'react-helmet-async';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { formatDate } from '../../../utils/formatTime';
import { useSettingsContext } from '../../../components/settings';
import './sell-operation.report.css';

export default function PurchaseGoodOperationReport() {
  const { themeStretch } = useSettingsContext();
  const { purchaseReports, selectedEndDate, selectedStartDate } = JSON.parse(
    localStorage.getItem('purchase-good')
  );

  setTimeout(() => {
    localStorage.removeItem('purchase-good');
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
                  Кол-во операций
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
                  Общая сумма закупа
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
                  Общая сумма тарнспортации
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
                  Общая сумма там. пошлины
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
                  Общая сумма др. расходов
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
                  Сред. себестоимость (за ед. товара)
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
                  Сред. цена закупа (за ед. товара)
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
                  Сред. сумма транспортации (за ед. товара)
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
                  Сред. там. пошлина (за ед. товара)
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
                  Сред. сумма др. расходов (за ед. товара)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchaseReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    {report.good?.name}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    {report.purchasedAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    {report.operationWithGoodCount?.toLocaleString()}
                  </TableCell>

                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${report.totalPurchasedGoodExpensesPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${report.totalTransportationExpensesPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${report.totalCustomDutyExpensesPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${report.totalOtherExpensesPrice?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${report.averageBasePriceOnPurchasesPerGood?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${report.averagePurchasesPricePerGood?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${report.averageTransportsPricePerGood?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${report.averageCustomsDutiesPricePerGood?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${report.averageOtherExpensesPricePerGood?.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Grid item xs={12} mt={5}>
            <Stack direction="row" spacing={2}>
              <Typography>
                Отчет по покупке товаров <strong>с: </strong>
                {selectedStartDate ? formatDate(selectedStartDate) : '<не указано>'}
              </Typography>
              <Typography>
                <strong>по: </strong>{' '}
                {selectedEndDate
                  ? formatDate(selectedEndDate)
                  : formatDate(new Date().toISOString())}
              </Typography>
            </Stack>

            <Typography mt={2} textAlign="end">
              <strong>Дата: __/__/____ </strong>
            </Typography>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
