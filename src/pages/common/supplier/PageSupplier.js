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
import {
  Container,
  Typography,
  Modal,
  Box,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import Iconify from '../../../components/iconify/Iconify';
import axios from '../../../utils/axios';
import { useSettingsContext } from '../../../components/settings';
import { formatPhoneUI } from '../../../utils/helper';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';

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

export default function PageSupplier() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [newSupplier, setNewSupplier] = useState({
    companyName: '',
    email: '',
    phone: '',
    inn: '',
    mfo: '',
    address: '',
    goodCategory: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleOpenEditModal = (supplier) => {
    setNewSupplier(supplier);
    // setOpenEditModal(true);
    setOpen(true);
  };
  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewSupplier({});
  };

  const supplierData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/supplier', {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          search: searchInput,
        },
      });
      if (response.data.success) {
        setSuppliers(response.data.data);
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  }, [enqueueSnackbar, searchInput]);
  const goodCategoryData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/good-category', {
        headers: { authorization: localStorage.getItem('accessToken') },
      });
      if (response.data.success) {
        setCategories(response.data.data);
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
    supplierData();
    goodCategoryData();
  }, [supplierData, goodCategoryData]);

  const createNewSupplierClickHandler = async () => {
    setButtonDisabled(() => true);
    try {
      if (newSupplier._id) {
        // update logic
        const response = await axios.patch(`/api/v1/supplier/${newSupplier._id}`, newSupplier, {
          headers: { authorization: localStorage.getItem('accessToken') },
        });

        if (response.data.success) {
          handleClose();
          supplierData();
          enqueueSnackbar('Client information updated successfully', {
            variant: 'success',
          });
          window.location.reload(true);
        }
      } else {
        // save logic
        const response = await axios.post('/api/v1/supplier', newSupplier, {
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
        <title>Поставщики</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Поставщики</Typography>

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
            <Button variant="contained" size="small" onClick={handleOpen} sx={{ p: 2.5 }}>
              + Добавить поставщика
            </Button>
          </Stack>
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 700, borderRadius: '16px' }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">#</StyledTableCell>
                  <StyledTableCell align="center">Комания</StyledTableCell>
                  <StyledTableCell align="center">Почта</StyledTableCell>
                  <StyledTableCell align="center">Номер телефона</StyledTableCell>
                  <StyledTableCell align="center">Адрес</StyledTableCell>
                  <StyledTableCell align="center">Действие</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.map((operation, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{operation.companyName}</StyledTableCell>
                    <StyledTableCell align="center">{operation.email}</StyledTableCell>
                    <StyledTableCell align="center">
                      {formatPhoneUI(operation?.phone)}
                    </StyledTableCell>
                    <StyledTableCell align="center">{operation.address}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenEditModal(operation)}
                        size="small"
                      >
                        Изменить
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        href={`/dashboard/dict/supplier/${operation._id}`}
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
            Новый поставщик (компания)
          </Typography>

          <Stack>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Наимнование компании*"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newSupplier.companyName}
                onChange={(event) =>
                  setNewSupplier({ ...newSupplier, companyName: event.target.value })
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
                value={newSupplier.phone}
                onChange={(event) => setNewSupplier({ ...newSupplier, phone: event.target.value })}
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
                value={newSupplier.email}
                onChange={(event) => setNewSupplier({ ...newSupplier, email: event.target.value })}
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
                value={newSupplier.inn}
                onChange={(event) => setNewSupplier({ ...newSupplier, inn: event.target.value })}
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
                value={newSupplier.mfo}
                onChange={(event) => setNewSupplier({ ...newSupplier, mfo: event.target.value })}
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
                value={newSupplier.address}
                onChange={(event) =>
                  setNewSupplier({ ...newSupplier, address: event.target.value })
                }
              />
            </FormControl>

            <FormControl sx={{ m: 1, ml: 2, minWidth: 100 }}>
              <InputLabel id="demo-select-small-label">Товарная категория</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="GoodFilter"
                value={newSupplier.goodCategory}
                onChange={(event) =>
                  setNewSupplier({ ...newSupplier, goodCategory: event.target.value })
                }
                sx={{ height: '60px' }}
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={buttonDisabled}
              onClick={createNewSupplierClickHandler}
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
