import { Container, Divider, Typography, Card, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';

import axios from '../../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import { useSettingsContext } from '../../../components/settings';
import { ConfirmDialog } from '../../../components/dialog/confirm-dialog';

export default function ExpenseInfoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [expense, setExpense] = useState({});

  const expenseInfoData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/expense/${id}`, {
        headers: { authorization: localStorage.getItem('accessToken') },
      });

      if (response.data.success) {
        setExpense(response.data.data);
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
  }, [enqueueSnackbar, id]);

  console.log({ expense });

  useEffect(() => {
    expenseInfoData();
  }, [expenseInfoData]);

  const deleteHandler = async () => {
    try {
      const response = await axios.delete(`api/v1/expense/${id}`);
      console.log(response);
      if (response.data.success) {
        navigate('/dashboard/finance/expense');
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
  useEffect(() => {
    expenseInfoData();
  }, [expenseInfoData]);
  // DIALOG
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Helmet>
        <title>Pасходы</title>
      </Helmet>
      <ConfirmDialog
        action={deleteHandler}
        open={open}
        handleClose={handleClose}
        title="Удаление Pасходa"
        description="Вы уверены что хотите удалить Pасходa? При удаление склада могут возникнуть проблемы с операциями с участием этого pасходa! Убедитесь что pасход больше не активный и что там не остались pасходa"
      />
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h3"> Pасходы Инфо</Typography>
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
                  color="error"
                  onClick={handleOpen}
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
                  <strong>Pасход</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {expense.name}
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
                  <strong>Oписание</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgb(108, 115, 127)',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {expense.description}
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
                  <strong>Сумма</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {expense.amount?.toLocaleString()}
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
                    {HHmmDDMMYYYY(expense.createdAt)}
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
