import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams } from 'react-router';
import { Button, Card, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import FormControl from '@mui/material/FormControl';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TableBody from '@mui/material/TableBody';
import { formatDate, HHmmDDMMYYYY } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import axios from '../../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import { useSettingsContext } from '../../../components/settings';
import ExportToXlsx from '../../../utils/xlsx';
import { ConfirmDialog } from '../../../components/dialog/confirm-dialog';

export default function PageStockInfo() {
  const { themeStretch } = useSettingsContext();

  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [stock, setStock] = useState({});
  const [stockItems, setStockItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const getDictionaries = useCallback(async () => {
    try {
      const [stockRes, stockItemRes] = await Promise.all([
        axios.get(`/api/v1/stock/${id}`, {
          headers: { authorization: localStorage.getItem('accessToken') },
          params: {
            date: selectedDate,
          },
        }),
        axios.get(`/api/v1/stock/stock-item/${id}`, {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
      ]);

      if (stockRes.data.success && stockItemRes.data.success) {
        setStock(stockRes.data.data);
        setStockItems(stockItemRes.data.data);
      } else {
        enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(stockRes.data.error[0])], {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  }, [id, enqueueSnackbar, selectedDate]);

  useEffect(() => {
    getDictionaries();
  }, [getDictionaries]);

  const deleteHandler = async () => {
    try {
      const response = await axios.delete(`api/v1/stock/${id}`);
      console.log(response);
      if (response.data.success) {
        navigate('/dashboard/storehouse/stock');
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

  const clearDate = () => {
    setSelectedDate('');
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

  const exportToXLSX = () => {
    const tableId = 'stock-info-table';
    ExportToXlsx(tableId, 'Отчет по остатке товаров');
  };

  // DIALOG
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Helmet>
        <title>Товар инфо</title>
      </Helmet>

      <ConfirmDialog
        action={deleteHandler}
        open={open}
        handleClose={handleClose}
        title="Удаление склада"
        description="Вы уверены что хотите удалить склад? При удаление склада могут возникнуть проблемы с операциями с участием этого склада! Убедитесь что склад больше не активный и что там не остались товары"
      />

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          mb={2}
          sx={{
            width: '100%',
          }}
        >
          <Button onClick={clearDate}>
            <Iconify icon="pajamas:retry" />
          </Button>
          <FormControl sx={{ width: '20%' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Дата:"
                slotProps={{ textField: { size: 'small' } }}
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </LocalizationProvider>
          </FormControl>
          <Button variant="outlined" color="success" sx={{ width: '200px' }} onClick={exportToXLSX}>
            Excel
          </Button>
        </Stack>
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
                {/* <Button */}
                {/*  variant="outlined" */}
                {/*  color="error" */}
                {/*  size="small" */}
                {/*  onClick={handleOpen} */}
                {/* > */}
                {/*  Удалить */}
                {/* </Button> */}
              </Stack>
              <Divider width="100%" />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '500px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Наимнование</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {stock.name}
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
                  <strong>ID</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {stock._id}
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
                  <strong>Дата добавления</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {HHmmDDMMYYYY(stock.createdAt)}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '2rem' }}>
              <TableContainer>
                <Table aria-label="customized table" id="stock-info-table">
                  <TableHead>
                    <StyledTableRow>
                      <StyledTableCell align="center">Дата</StyledTableCell>
                      <StyledTableCell align="center">Товар</StyledTableCell>
                      <StyledTableCell align="center">Категория товара</StyledTableCell>
                      <StyledTableCell align="center">Остаток на этом складе</StyledTableCell>
                      <StyledTableCell align="center">Остаток на всех складах</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {stockItems.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">
                          {HHmmDDMMYYYY(item.good?.createdAt)}
                        </StyledTableCell>
                        <StyledTableCell align="center">{item.good?.name}</StyledTableCell>
                        <StyledTableCell align="center">
                          {item.good?.category?.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {item.leftAmount?.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {item.good.leftAmount?.toLocaleString()}
                        </StyledTableCell>
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
