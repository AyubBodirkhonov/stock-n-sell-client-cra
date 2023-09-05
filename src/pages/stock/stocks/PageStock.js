import { useCallback, useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, Typography, Box, Modal, FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import Iconify from '../../../components/iconify/Iconify';
import axios from '../../../utils/axios';
import { useSettingsContext } from '../../../components/settings';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';

// import of images

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

export default function PageStock() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [stocks, setStocks] = useState([]);
  const [newStock, setNewStock] = useState({ name: '', address: '' });
  const [searchInput, setSearchInput] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const stockData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/stock', {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          search: searchInput,
        },
      });

      if (response.data.success) {
        setStocks(response.data.data);
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

  useEffect(() => {
    stockData();
  }, [stockData]);
  const handleOpenEditModal = (stock) => {
    setNewStock(stock);
    // setOpenEditModal(true);
    setOpen(true);
    console.log(newStock);
  };

  const validForm = () => newStock.name && newStock.address && !buttonDisabled;

  const createStockClickHandler = async () => {
    setButtonDisabled(() => true);
    try {
      if (newStock._id) {
        // update logic
        const response = await axios.patch(`/api/v1/stock/${newStock._id}`, newStock, {
          headers: { authorization: localStorage.getItem('accessToken') },
        });
        console.log({ response });

        if (response.data.success) {
          handleClose();
          stockData();
          enqueueSnackbar('Client information updated successfully', {
            variant: 'success',
          });
        }
      } else {
        // save logic
        const response = await axios.post('/api/v1/stock', newStock, {
          headers: { authorization: localStorage.getItem('accessToken') },
        });

        if (response.data.success) {
          window.location.reload(false);
        } else {
          enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(response.data.error[0])], {
            variant: SnackbarType.error,
          });
        }
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
        <title>Склад</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Склады</Typography>

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
              <Iconify icon="pajamas:retry" />
            </Button>
          </Stack>

          <Stack direction="row" spacing={{ xs: 6, md: 2 }} alignItems="center">
            <Button variant="contained" size="small" sx={{ p: 2.5 }} onClick={handleOpen}>
              + Добавить склад
            </Button>
          </Stack>
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 700, borderRadius: '16px' }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Дата создания</StyledTableCell>
                  <StyledTableCell align="center">Имя склада</StyledTableCell>
                  <StyledTableCell align="center">Адрес</StyledTableCell>
                  <StyledTableCell align="center">Действия</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stocks.map((stock) => (
                  <StyledTableRow key={stock?._id}>
                    <StyledTableCell align="center">
                      {HHmmDDMMYYYY(stock.createdAt)}
                    </StyledTableCell>

                    <StyledTableCell align="center">{stock.name}</StyledTableCell>
                    <StyledTableCell align="center">{stock.address}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenEditModal(stock)}
                        size="small"
                      >
                        Изменить
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        href={`/dashboard/storehouse/stock/${stock._id}`}
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
            Новый склад
          </Typography>

          <Stack>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Наименование"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newStock.name}
                onChange={(event) => setNewStock({ ...newStock, name: event.target.value })}
              />
            </FormControl>

            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Адрес"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newStock.address}
                onChange={(event) => setNewStock({ ...newStock, address: event.target.value })}
              />
            </FormControl>
          </Stack>

          <Stack>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={!validForm()}
              onClick={createStockClickHandler}
              sx={{ p: 2.5, m: 2 }}
            >
              Сохранить
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
