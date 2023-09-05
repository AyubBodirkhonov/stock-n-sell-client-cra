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
import { Container, Typography, FormControl, Box, Modal } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import Iconify from '../../../components/iconify/Iconify';
import axios from '../../../utils/axios';
import { useSettingsContext } from '../../../components/settings';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import { formatPhoneUI } from '../../../utils/helper';
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

// Define the EditClientModal component

export default function PageClient() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    companyName: '',
    email: '',
    phone: '',
    inn: '',
    mfo: '',
    address: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Modal

  // Open the edit modal and set the selected client
  const handleOpenEditModal = (client) => {
    setNewClient(client);
    setOpen(true);
  };

  // Close the edit modal and reset the selected client

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewClient({});
  };

  const clientData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/client', {
        headers: { authorization: localStorage.getItem('accessToken') },
      });

      if (response.data.success) {
        setClients(response.data.data);
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

  useEffect(() => {
    clientData();
  }, [clientData]);

  const createNewClientClickHandler = async () => {
    setButtonDisabled(() => true);
    try {
      if (newClient._id) {
        // update logic
        const response = await axios.patch(`/api/v1/client/${newClient._id}`, newClient, {
          headers: { authorization: localStorage.getItem('accessToken') },
        });

        if (response.data.success) {
          handleClose();
          clientData();
          enqueueSnackbar('Client information updated successfully', {
            variant: 'success',
          });
          window.location.reload();
        }
      } else {
        // save logic
        const response = await axios.post('/api/v1/client', newClient, {
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
        <title>Клиенты</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Список клиентов</Typography>

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
            />
            <Button>
              <Iconify icon="pajamas:retry" />
            </Button>
          </Stack>

          <Stack direction="row" spacing={{ xs: 6, md: 2 }} alignItems="center">
            <Button variant="contained" size="small" onClick={handleOpen} sx={{ p: 2.5 }}>
              + Добавить клиента
            </Button>
          </Stack>
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 700, borderRadius: '16px' }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">#</StyledTableCell>
                  <StyledTableCell align="center">Компания</StyledTableCell>
                  <StyledTableCell align="center">Почта</StyledTableCell>
                  <StyledTableCell align="center">Номер телефона</StyledTableCell>
                  <StyledTableCell align="center">Адрес</StyledTableCell>
                  <StyledTableCell align="center">Действие</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>

                    <StyledTableCell align="center">{client.companyName}</StyledTableCell>
                    <StyledTableCell align="center">
                      {client.email ?? '<не указан>'}
                    </StyledTableCell>
                    <StyledTableCell align="center">{formatPhoneUI(client.phone)}</StyledTableCell>
                    <StyledTableCell align="center">
                      {client.address ?? '<не указан>'}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenEditModal(client)}
                        size="small"
                      >
                        Изменить
                      </Button>
                      <Button
                        variant="outlined"
                        href={`/dashboard/dict/client/${client._id}`}
                        size="small"
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
            Новый клиент (компания)
          </Typography>

          <Stack>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Наимнование компании*"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newClient.companyName}
                onChange={(event) =>
                  setNewClient({ ...newClient, companyName: event.target.value })
                }
              />
            </FormControl>

            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Номер телефона*"
                variant="outlined"
                type="number"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newClient.phone}
                onChange={(event) => setNewClient({ ...newClient, phone: event.target.value })}
              />
            </FormControl>

            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Почта e-mail"
                variant="outlined"
                type="email"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newClient.email}
                onChange={(event) => setNewClient({ ...newClient, email: event.target.value })}
              />
            </FormControl>

            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="ИНН"
                variant="outlined"
                type="text"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newClient.inn}
                onChange={(event) => setNewClient({ ...newClient, inn: event.target.value })}
              />
            </FormControl>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="МФО"
                variant="outlined"
                type="text"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newClient.mfo}
                onChange={(event) => setNewClient({ ...newClient, mfo: event.target.value })}
              />
            </FormControl>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Адрес*"
                variant="outlined"
                type="text"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newClient.address}
                onChange={(event) => setNewClient({ ...newClient, address: event.target.value })}
              />
            </FormControl>
          </Stack>

          <Stack>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={buttonDisabled}
              onClick={createNewClientClickHandler}
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
