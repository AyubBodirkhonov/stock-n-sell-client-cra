import { Container, Typography, Grid, Divider, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Helmet } from 'react-helmet-async';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';

import axios from '../../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import { useSettingsContext } from '../../../components/settings';
import { ConfirmDialog } from '../../../components/dialog/confirm-dialog';

export default function ExpenseCategoryInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [expenseCategory, setExpenseCategory] = useState({});
  const [expense, setExpense] = useState([]);

  const getExps = useCallback(async () => {
    try {
      const [expenseCategoryRes, expenseRes] = await Promise.all([
        axios.get(`/api/v1/expense-category/${id}`, {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
        axios.get(`/api/v1/expense`, {
          headers: { authorization: localStorage.getItem('accessToken') },
          params: {
            category: id,
          },
        }),
      ]);
      console.log({ expenseCategoryRes });
      console.log({ expenseRes });

      if (expenseCategoryRes.data.success && expenseRes.data.success) {
        setExpenseCategory(expenseCategoryRes.data.data);
        setExpense(expenseRes.data.data);
      } else {
        enqueueSnackbar(
          SnackbarMessage.error[BackendErrorHandler(expenseCategoryRes.data.error[0])],
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
  }, [id, enqueueSnackbar]);

  useEffect(() => {
    getExps();
  }, [getExps]);

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

  const deleteHandler = async () => {
    try {
      const response = await axios.delete(`api/v1/expense-category/${id}`);
      console.log(response);
      if (response.data.success) {
        navigate('/dashboard/finance/expense-category');
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
  // DIALOG
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Helmet>
        <title> Kатегория Pасходoв</title>
      </Helmet>
      <ConfirmDialog
        action={deleteHandler}
        open={open}
        handleClose={handleClose}
        title="Удаление Kатегория Pасходa"
        description="Вы уверены что хотите удалить Kатегория Pасходoв? При удаление склада могут возникнуть проблемы с операциями с участием этого Kатегории! Убедитесь что Kатегория больше не активный и что там не остались Kатегория Pасходoв"
      />
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3">Kатегория Pасходы Инфо</Typography>
        <Grid container my={3}>
          <Grid item xs={12} mb={2}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                p: 3,
                gap: '10px',
              }}
            >
              <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                <Typography variant="h6" color="primary">
                  Базовая информация
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ marginLeft: '10px' }}
                  onClick={handleOpen}
                  color="error"
                >
                  Удалить
                </Button>
              </Stack>
              <Divider width="100%" />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '500px', md: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Категория расхода</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {expenseCategory.name}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: { xs: '500px', md: '700px' } }}
              >
                <Typography variant="subtitle2">
                  <strong>Дата</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {HHmmDDMMYYYY(expenseCategory.createdAt)}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer>
                <Table sx={{ minWidth: 700, borderRadius: '16px' }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Дата</StyledTableCell>
                      <StyledTableCell align="center">Pасход</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expense.map((exp, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">
                          {HHmmDDMMYYYY(exp.createdAt)}
                        </StyledTableCell>
                        <StyledTableCell align="center">{exp.name}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
