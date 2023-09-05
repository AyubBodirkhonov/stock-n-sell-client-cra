import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { Container, Grid, Card, Typography, Divider, Stack, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';

import CircularProgress from '@mui/material/CircularProgress';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';
import axios from '../../../utils/axios';
import { useSettingsContext } from '../../../components/settings';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import { SellOperationStatusRu } from '../../dictionary/sell-operation.dictionary';
import { ConfirmDialog } from '../../../components/dialog/confirm-dialog';

export default function PageClientInfo() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [client, setClient] = useState({});
  const [clientPurchases, setClientPurchases] = useState([]);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const handleChangePage = (event, newPage) => {
    setPage(+newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getDicts = useCallback(async () => {
    try {
      const [clientRes, clientPurchasesRes] = await Promise.all([
        axios.get(`/api/v1/client/${id}`, {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
        axios.get('/api/v1/sell-operation', {
          headers: { authorization: localStorage.getItem('accessToken') },
          params: {
            client: id,
            limit: rowsPerPage,
            skip: (page - 1) * rowsPerPage,
          },
        }),
      ]);

      if (clientRes.data.success && clientPurchasesRes.data.success) {
        setClient(clientRes.data.data);
        setClientPurchases(clientPurchasesRes.data.data);
      } else {
        enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(clientRes.data.error[0])], {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  }, [rowsPerPage, page, id, enqueueSnackbar]);

  useEffect(() => {
    getDicts();
  }, [getDicts]);

  const deleteHandler = async () => {
    try {
      const response = await axios.delete(`api/v1/client/${id}`);
      console.log({ response });
      if (response.data.success) {
        navigate('/dashboard/dict/client');
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

  // DIALOG
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Helmet>
        <title>Клиент инфо</title>
      </Helmet>

      <ConfirmDialog
        action={deleteHandler}
        open={open}
        handleClose={handleClose}
        title="Удаление клиента"
        description="Вы уверены что хотите удалить клиента? При удаление клиента могут возникнуть проблемы с операциями с участием этого клиента! Проверьте еще раз на наличие операций, если операций нет, то всё хорошо"
      />

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container>
          <Grid item xs={12}>
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
                <Button variant="outlined" color="error" size="small" onClick={handleOpen}>
                  Удалить
                </Button>
              </Stack>

              <Divider width="100%" />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '500px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Клиент</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {client.companyName}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '500px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Адрес</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {client.address}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '500px' }}
              >
                <Typography variant="subtitle2">
                  <strong>ИНН</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {client.inn}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '500px' }}
              >
                <Typography variant="subtitle2">
                  <strong>МФО</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {client.mfo}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '500px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Почта</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {client.email}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '500px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Номер телефона</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    +{client.phone}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Stack sx={{ marginTop: 4 }}>
            <Typography variant="h6">Операции с клиентом</Typography>
          </Stack>
          <Grid item xs={12}>
            <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '1rem' }}>
              <TableContainer>
                <Table aria-label="customized table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center">Дата</StyledTableCell>
                      <StyledTableCell align="center">Склад</StyledTableCell>
                      <StyledTableCell align="center">Номер инвойса</StyledTableCell>
                      <StyledTableCell align="center">Наличными</StyledTableCell>
                      <StyledTableCell align="center">Безнал</StyledTableCell>
                      <StyledTableCell align="center">Прибыль</StyledTableCell>
                      <StyledTableCell align="center">Общая сумма</StyledTableCell>
                      <StyledTableCell align="center">Заплачено</StyledTableCell>
                      <StyledTableCell align="center">Осталось заплатить</StyledTableCell>
                      <StyledTableCell align="center">Статус</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {clientPurchases.map((purchase, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">
                          {HHmmDDMMYYYY(purchase.createdAt)}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            href={`/dashboard/storehouse/stock/${purchase.fromStock?._id}`}
                          >
                            {purchase.fromStock?.name}
                          </Button>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Button href={`/dashboard/operation/sell-operation/${purchase._id}`}>
                            {purchase.invoiceCount?.toLocaleString()}
                          </Button>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {purchase.paidInCash?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {purchase.paidInNoCash?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {purchase.profit?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {purchase.totalPrice?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {purchase.totallyPaid?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {purchase.leftToPay?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Button
                            variant="outlined"
                            color={
                              // eslint-disable-next-line no-nested-ternary
                              purchase.status.toLowerCase() === 'planned'
                                ? 'secondary'
                                : // eslint-disable-next-line no-nested-ternary
                                purchase.status.toLowerCase() === 'conducted'
                                ? 'primary'
                                : purchase.status.toLowerCase() === 'cancelled'
                                ? 'error'
                                : 'warning'
                            }
                            size="small"
                          >
                            {SellOperationStatusRu[purchase.status]}
                            {purchase.status.toLowerCase() === 'pending' ? (
                              <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />
                            ) : (
                              ''
                            )}
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={clientPurchases.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
