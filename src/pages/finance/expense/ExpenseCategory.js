import { Box, Container, FormControl, Modal, Typography } from '@mui/material';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import Iconify from '../../../components/iconify';
import { useSettingsContext } from '../../../components/settings';
import axios from '../../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';

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

export default function ExpenseCategory() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [newExpenseCategory, setNewExpenseCategory] = useState({
    name: '',
  });
  const [searchInput, setSearchInput] = useState('');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const expenseCategoryData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/expense-category', {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          search: searchInput,
        },
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
  }, [enqueueSnackbar, searchInput]);

  const validForm = () => !buttonDisabled && newExpenseCategory.name;

  useEffect(() => {
    expenseCategoryData();
  }, [expenseCategoryData]);

  const clearSearchInput = () => {
    setSearchInput('');
  };

  const createNewExpenseCategoryClickHandler = async () => {
    setButtonDisabled(() => true);
    try {
      const response = await axios.post('/api/v1/expense-category', newExpenseCategory, {
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
        <title>категория расходов</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3">Категория расходов</Typography>
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
            <Button>
              <Iconify icon="pajamas:retry" onClick={clearSearchInput} />
            </Button>
          </Stack>

          <Stack direction="row" spacing={{ xs: 6, md: 2 }} alignItems="center">
            <Button variant="contained" size="small" onClick={handleOpen} sx={{ p: 2.5 }}>
              + Добавить категорию
            </Button>
          </Stack>
        </Stack>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 700, borderRadius: '16px' }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Дата</StyledTableCell>
                  <StyledTableCell align="center">Наимнование категории</StyledTableCell>
                  <StyledTableCell align="center">Действие</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenseCategories.map((category, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">
                      {HHmmDDMMYYYY(category.createdAt)}
                    </StyledTableCell>
                    <StyledTableCell align="center">{category.name}</StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        href={`/dashboard/finance/expense-category/${category._id}`}
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
            Новая категория расходов
          </Typography>

          <Stack>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Наимнование "
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newExpenseCategory.name}
                onChange={(event) =>
                  setNewExpenseCategory({
                    ...newExpenseCategory,
                    name: event.target.value,
                  })
                }
              />
            </FormControl>
          </Stack>

          <Stack>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ p: 2.5, m: 2 }}
              disabled={!validForm()}
              onClick={createNewExpenseCategoryClickHandler}
            >
              Сохранить
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
