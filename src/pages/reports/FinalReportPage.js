import { useCallback, useEffect, useState } from 'react';
import { Container, Stack, Typography } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import FormControl from '@mui/material/FormControl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import Iconify from '../../components/iconify';
import { useSettingsContext } from '../../components/settings';
import axios from '../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../utils/backend-error-handler';

export default function FinalReportPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [generalReports, setGeneralReports] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const clearFilter = () => {
    setSelectedStartDate('');
    setSelectedEndDate('');
  };

  const generalReportData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/report/spec/main', {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          startDate: selectedStartDate,
          endDate: selectedEndDate,
        },
      });
      if (response.data.success) {
        setGeneralReports(response.data.data);
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
  console.log({ generalReports });
  useEffect(() => {
    generalReportData();
  }, [generalReportData]);

  return (
    <>
      <Helmet>
        <title>Final Report</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3"> Общий отчет</Typography>

        <Stack spacing={2} direction="row" my={3}>
          {' '}
          <FormControl sx={{ width: '20%' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="С:"
                slotProps={{ textField: { size: 'small' } }}
                value={selectedStartDate}
                onChange={(date) => setSelectedStartDate(date)}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl sx={{ width: '20%' }}>
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                >
                  Махсулот номи
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
                  Ўлчов бирлиги
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
                  Миқдори
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
                  Товар Нархи
                </TableCell>
                <TableCell
                  align="center"
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                    borderRight: 'none',
                  }}
                >
                  Товар жами Сумма
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#ffcccb',
                    color: 'black',
                  }}
                  align="center"
                >
                  Юл кира
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#ffcccb',
                    color: 'black',
                  }}
                  align="center"
                >
                  Бож тулов
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#ffcccb',
                    color: 'black',
                  }}
                >
                  Прочи
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#ffcccb',
                    color: 'black',
                  }}
                  align="center"
                >
                  Жами
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                  align="center"
                >
                  <Stack spacing={1} direction="row">
                    <span>1</span>
                    <Typography>Дона</Typography>
                  </Stack>
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                  align="center"
                >
                  Жами
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                  align="center"
                >
                  миқдори
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                  align="center"
                >
                  сумма
                </TableCell>

                <TableCell
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                  align="center"
                >
                  фойда
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                  align="center"
                >
                  миқдори
                </TableCell>
                <TableCell
                  style={{
                    border: '1px solid black',
                    padding: '8px',
                    backgroundColor: '#fff',
                    color: 'black',
                  }}
                  align="center"
                >
                  сумма
                </TableCell>
              </TableRow>
            </TableHead>
            {generalReports.map((report, index) => (
              <TableBody key={index}>
                <TableRow>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                    }}
                  >
                    {report.good?.name}
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
                    {report.good?.measure}
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
                    {report.amountOnStartPeriod}
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
                    {report.goodPurchasePrice?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      paddingLeft: '11px',
                    }}
                  >
                    {report.goodInMoney?.toLocaleString()}
                  </TableCell>

                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      borderTop: 'none',
                      borderLeft: 'none',
                    }}
                  >
                    {report.expenses?.transport?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      borderTop: 'none',
                      borderLeft: 'none',
                    }}
                  >
                    {report.expenses?.customsDuty?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      borderTop: 'none',
                      borderLeft: 'none',
                    }}
                  >
                    {report.expenses?.otherExpenses?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      borderTop: 'none',
                      borderLeft: 'none',
                    }}
                  >
                    {report.expenses?.totalExpense?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      borderTop: 'none',
                      borderLeft: 'none',
                    }}
                  >
                    {report.basePrice?.perGood?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      borderTop: 'none',
                      borderLeft: 'none',
                    }}
                  >
                    {report.basePrice?.total?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      borderTop: 'none',
                      borderLeft: 'none',
                    }}
                  >
                    {report.sold?.amount?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      borderTop: 'none',
                      borderLeft: 'none',
                    }}
                  >
                    {report.sold?.price?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      borderTop: 'none',
                      borderLeft: 'none',
                    }}
                  >
                    {report.profit?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      borderTop: 'none',
                      borderLeft: 'none',
                    }}
                  >
                    {report.goodLeft?.amount?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                      borderTop: 'none',
                      borderLeft: 'none',
                    }}
                  >
                    {report.goodLeft?.inMoney?.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
