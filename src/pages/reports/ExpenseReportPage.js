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
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { HHmmDDMMYYYY } from '../../utils/formatTime';
import Iconify from '../../components/iconify';
import { useSettingsContext } from '../../components/settings';
import axios from '../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../utils/backend-error-handler';
import ExportToXlsx from '../../utils/xlsx';

export default function ExpenseReportPage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [expenseReports, setExpenseReports] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [filterOption, setFilterOption] = useState({
    category: '',
  });
  const [expenseCategories, setExpenseCategories] = useState([]);

  const clearFilter = () => {
    setSelectedStartDate('');
    setSelectedEndDate('');
    setFilterOption({});
  };

  const expenseReportData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/expense', {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          ...filterOption,
        },
      });
      if (response.data.success) {
        setExpenseReports(response.data.data);
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
  }, [enqueueSnackbar, selectedStartDate, selectedEndDate, filterOption]);

  const expenseCategoryData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/expense-category', {
        headers: { authorization: localStorage.getItem('accessToken') },
      });

      if (response.data.success) {
        setExpenseCategories(response.data.data);
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
  }, [enqueueSnackbar]);

  console.log({ expenseReports });

  useEffect(() => {
    expenseReportData();
    expenseCategoryData();
  }, [expenseReportData, expenseCategoryData]);

  const exportXlsx = () => {
    const tableId = 'report-expense';
    ExportToXlsx(tableId, 'Отчет по покупке товаров');
  };

  return (
    <>
      <Helmet>
        <title>Final Report</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3"> Expense Report</Typography>

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
          <FormControl sx={{ ml: 2, width: '18%' }} size="small">
            <InputLabel id="demo-select-small-label">категория</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="GoodFilter"
              value={filterOption.category}
              onChange={(event) =>
                setFilterOption({ ...filterOption, category: event.target.value })
              }
            >
              <MenuItem value="">-</MenuItem>
              {expenseCategories.map((category) => (
                <MenuItem value={category._id}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={() => {
              clearFilter();
            }}
          >
            <Iconify icon="pajamas:retry" />
          </Button>
          <Button variant="outlined" size="small" sx={{ p: 2.5, mr: 2 }} onClick={exportXlsx}>
            Excel
          </Button>
        </Stack>
        <TableContainer>
          <Table id="report-expense">
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
                  Дата
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
                  Наименование
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
                  Сумма
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
                  Категория
                </TableCell>
              </TableRow>
            </TableHead>
            {expenseReports.map((report) => (
              <TableBody>
                <TableRow key={report._id}>
                  <TableCell
                    align="center"
                    style={{
                      border: '1px solid black',
                      padding: '8px',
                      backgroundColor: '#fff',
                      color: 'black',
                    }}
                  >
                    {HHmmDDMMYYYY(report.createdAt)}
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
                    {report.name}
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
                    {report.amount}
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
                    {report.category?.name}
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
