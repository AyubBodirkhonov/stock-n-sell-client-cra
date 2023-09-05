import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useSnackbar } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Iconify from '../../../components/iconify';

import { HHmmDDMMYYYY } from '../../../utils/formatTime';

import axios from '../../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import { useSettingsContext } from '../../../components/settings';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function ExpensePage() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [expenses, setExpenses] = useState([]);
  const [expenseCategoryData, setExpenseCategoryData] = useState([]);
  const [newExpense, setNewExpense] = useState({
    name: '',
    description: '',
    amount: null,
    category: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const getExpenses = useCallback(async () => {
    try {
      const [expenseRes, expenseCategoryRes] = await Promise.all([
        axios.get('/api/v1/expense', {
          headers: { authorization: localStorage.getItem('accessToken') },
          params: {
            search: searchInput,
          },
        }),
        axios.get('/api/v1/expense-category'),
        {
          headers: { authorization: localStorage.getItem('accessToken') },
        },
      ]);

      console.log({ expenseCategoryRes, expenseRes });
      if (expenseRes.data.success && expenseCategoryRes.data.success) {
        setExpenses(expenseRes.data.data);
        setExpenseCategoryData(expenseCategoryRes.data.data);
      } else {
        enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(expenseRes.data.error[0])], {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  }, [enqueueSnackbar, searchInput]);

  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

  const clearSearchInput = () => {
    setSearchInput('');
  };

  const validExpense = () => {
    let valid = false;

    if (
      newExpense.amount > 0 &&
      newExpense.name &&
      newExpense.category &&
      newExpense.description &&
      !buttonDisabled
    ) {
      valid = true;
    }

    return valid;
  };

  const createNewExpenseClickHandler = async () => {
    setButtonDisabled(() => true);
    try {
      const response = await axios.post('/api/v1/expense', newExpense, {
        headers: { authorization: localStorage.getItem('accessToken') },
      });

      if (response.data.success) {
        window.location.reload(false);
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

  return (
    <>
      <Helmet>
        <title>Pасходы</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3">Pасходы </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          mb={{ xs: 2, md: '0' }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={1}
            sx={{ my: 2, width: { xs: '100%', md: '40%' } }}
          >
            <TextField
              id="outlined"
              label="Поиск"
              variant="outlined"
              sx={{ width: '100%' }}
              autoComplete="off"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <Button onClick={clearSearchInput}>
              <Iconify icon="pajamas:retry" />
            </Button>
          </Stack>

          <Stack direction="row" spacing={{ xs: 6, md: 2 }} alignItems="center">
            <Button variant="contained" size="small" sx={{ p: 2.5 }} onClick={handleOpen}>
              + Добавить расход
            </Button>
          </Stack>
        </Stack>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 700, borderRadius: '16px' }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Дата</StyledTableCell>
                  <StyledTableCell align="center">Наименование расхода</StyledTableCell>
                  <StyledTableCell align="center">Сумма</StyledTableCell>
                  <StyledTableCell align="center">Категория расхода</StyledTableCell>
                  <StyledTableCell align="center">Действие</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">
                      {HHmmDDMMYYYY(expense.createdAt)}
                    </StyledTableCell>
                    <StyledTableCell align="center">{expense.name}</StyledTableCell>
                    <StyledTableCell align="center">{expense.amount}</StyledTableCell>
                    <StyledTableCell align="center">{expense.category?.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        href={`/dashboard/finance/expense/${expense._id}`}
                        sx={{ marginLeft: '10px' }}
                      >
                        Детали
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Новый Pасход
          </Typography>

          <Stack>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Наименование"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newExpense.name}
                onChange={(event) => setNewExpense({ ...newExpense, name: event.target.value })}
              />
            </FormControl>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Описание"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newExpense.description}
                onChange={(event) =>
                  setNewExpense({ ...newExpense, description: event.target.value })
                }
              />
            </FormControl>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Сумма"
                type="number"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newExpense.amount}
                onChange={(event) => setNewExpense({ ...newExpense, amount: +event.target.value })}
              />
            </FormControl>

            <FormControl sx={{ m: 1, ml: 2, minWidth: 100 }}>
              <InputLabel id="demo-select-small-label">Kатегория расхода</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Select Good"
                value={newExpense.category}
                onChange={(event) => setNewExpense({ ...newExpense, category: event.target.value })}
                sx={{ height: '60px' }}
              >
                {expenseCategoryData.map((cat, index) => (
                  <MenuItem key={index} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, ml: 2, width: '97%' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Дата:"
                  slotProps={{ textField: { size: 'small' } }}
                  value={newExpense.createdAt}
                  onChange={(date) => setNewExpense({ ...newExpense, createdAt: date })}
                />
              </LocalizationProvider>
            </FormControl>
          </Stack>

          <Stack>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ p: 2.5, m: 2 }}
              disabled={!validExpense()}
              onClick={createNewExpenseClickHandler}
            >
              Сохранить
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
