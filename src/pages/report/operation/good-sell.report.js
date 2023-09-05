import { Box, Container, Divider, Grid, Stack, Typography } from '@mui/material';

import { Helmet } from 'react-helmet-async';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { formatDate, HHmmDDMMYYYY } from '../../../utils/formatTime';
import { useSettingsContext } from '../../../components/settings';
import './sell-operation.report.css';

export default function GoodSellsOperationReport() {
  const { themeStretch } = useSettingsContext();
  const {
    goodSellReports: goodSellOperation,
    selectedEndDate,
    selectedStartDate,
  } = JSON.parse(localStorage.getItem('good-sell'));

  setTimeout(() => {
    localStorage.removeItem('good-sell');
  }, 7000);

  return (
    <>
      <Helmet>
        <title>Печать отчета</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Box id="print-only">
          <Typography variant="h5" textAlign="center">
            Отчет по продаже товаров
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
                  Кол-во продано
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
                  Общая прибыль по товару
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
                  Операции с товаром
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
                  Средняя цена продажи
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
                  Средняя прибыль / товар
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
                  Средняя себестоимость товара
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {goodSellOperation.map((item, index) => (
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
                    {item.soldAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${item.profitByGood?.toLocaleString()}
                  </TableCell>

                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    {item.operationWithGoodCount?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${item.averageSoldPriceByOperation?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${item.averageProfitByGood?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ border: '1px solid black', padding: '8px', backgroundColor: '#fff' }}
                  >
                    ${item.averageBasePriceOnSellOperations?.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Grid item xs={12} mt={5}>
            <Stack direction="row" spacing={2}>
              <Typography>
                Отчет по проданным товарам <strong>с: </strong>
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
