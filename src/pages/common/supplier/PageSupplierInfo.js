import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router';
import { Button, Card, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { HHmmDDMMYYYY } from '../../../utils/formatTime';
import axios from '../../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import { useSettingsContext } from '../../../components/settings';
import { SellOperationStatusRu } from '../../dictionary/sell-operation.dictionary';
import { ConfirmDialog } from '../../../components/dialog/confirm-dialog';

export default function PageSupplierInfo() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState({});
  const [supplierSells, setSupplierSells] = useState([]);

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
      const [supplierRes, supplierSellsRes] = await Promise.all([
        axios.get(`/api/v1/supplier/${id}`, {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
        axios.get('/api/v1/stock-operation', {
          headers: { authorization: localStorage.getItem('accessToken') },
          params: {
            supplier: id,
            limit: rowsPerPage,
            skip: (page - 1) * rowsPerPage,
          },
        }),
      ]);

      if (supplierRes.data.success && supplierSellsRes.data.success) {
        setSupplier(supplierRes.data.data);
        setSupplierSells(supplierSellsRes.data.data);
      } else {
        enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(supplierRes.data.error[0])], {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  }, [rowsPerPage, page, id, enqueueSnackbar]);

  console.log({ supplierSells });
  useEffect(() => {
    getDicts();
  }, [getDicts]);

  const deleteHandler = async () => {
    try {
      const response = await axios.delete(`api/v1/supplier/${id}`);
      console.log({ response });
      if (response.data.success) {
        navigate('/dashboard/dict/supplier');
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
        <title>Поставщик инфо</title>
      </Helmet>

      <ConfirmDialog
        action={deleteHandler}
        open={open}
        handleClose={handleClose}
        title="Удаление поставщика"
        description="Вы уверены что хотите удалить поставщика? При удаление поставщика могут возникнуть проблемы с операциями с участием этого поставщика! Проверьте еще раз на наличие операций, если операций нет, то всё хорошо"
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
                  <strong>Поставщик</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {supplier.companyName}
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
                    {supplier.address}
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
                    {supplier.inn}
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
                    {supplier.mfo}
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
                    {supplier.email}
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
                    +{supplier.phone}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '2rem' }}>
              <TableContainer>
                <Table aria-label="customized table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center">Дата</StyledTableCell>
                      <StyledTableCell align="center">Склад</StyledTableCell>
                      <StyledTableCell align="center">Наличные</StyledTableCell>
                      <StyledTableCell align="center">Безнал</StyledTableCell>
                      <StyledTableCell align="center">Общая сумма</StyledTableCell>
                      <StyledTableCell align="center">Заплачено</StyledTableCell>
                      <StyledTableCell align="center">Осталось заплатить</StyledTableCell>
                      <StyledTableCell align="center">Статус</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {supplierSells.map((sell, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">
                          {HHmmDDMMYYYY(sell.createdAt)}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            href={`/dashboard/storehouse/stock/${sell.stock?._id}`}
                          >
                            {sell.stock?.name}
                          </Button>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {sell.paidInCash?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {sell.paidInNoCash?.toLocaleString()}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          {sell.totalPrice?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {sell.totallyPaid?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {sell.leftToPay?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Button
                            variant="outlined"
                            color={
                              // eslint-disable-next-line no-nested-ternary
                              sell.status.toLowerCase() === 'planned'
                                ? 'secondary'
                                : // eslint-disable-next-line no-nested-ternary
                                sell.status.toLowerCase() === 'conducted'
                                ? 'primary'
                                : sell.status.toLowerCase() === 'cancelled'
                                ? 'error'
                                : 'warning'
                            }
                            size="small"
                          >
                            {SellOperationStatusRu[sell.status]}
                            {sell.status.toLowerCase() === 'pending' ? (
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
                count={supplierSells.length}
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
