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

export default function PageGoodCategory() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [newGoodCategory, setNewGoodCategory] = useState({ name: '' });
  const [searchInput, setSearchInput] = useState('');

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const goodCategoryData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/good-category', {
        params: {
          search: searchInput,
        },
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
  }, [enqueueSnackbar, searchInput]);

  useEffect(() => {
    goodCategoryData();
  }, [goodCategoryData]);

  const handleOpenEditModal = (category) => {
    setNewGoodCategory(category);
    // setOpenEditModal(true);
    setOpen(true);
  };
  const resetSearch = () => {
    setSearchInput('');
  };
  const validForm = () => !buttonDisabled && newGoodCategory.name;

  const createGoodCategoryClickHandler = async () => {
    setButtonDisabled(() => true);
    try {
      if (newGoodCategory._id) {
        // update logic
        const response = await axios.patch(
          `/api/v1/good-category/${newGoodCategory._id}`,
          newGoodCategory,
          {
            headers: { authorization: localStorage.getItem('accessToken') },
          }
        );
        console.log({ response });

        if (response.data.success) {
          handleClose();
          goodCategoryData();
          enqueueSnackbar('Client information updated successfully', {
            variant: 'success',
          });
        }
      } else {
        // save logic
        const response = await axios.post('/api/v1/good-category', newGoodCategory, {
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
        <title>Товарная категория</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Товарная категория</Typography>

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
              <Iconify icon="pajamas:retry" onClick={resetSearch} />
            </Button>
          </Stack>

          <Stack direction="row" spacing={{ xs: 6, md: 2 }} alignItems="center">
            <Button variant="contained" size="small" onClick={handleOpen} sx={{ p: 2.5 }}>
              + Добавить товарную категорию
            </Button>
          </Stack>
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 700, borderRadius: '16px' }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">#</StyledTableCell>

                  <StyledTableCell align="center">Наименование</StyledTableCell>
                  <StyledTableCell align="center">Действие</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>

                    <StyledTableCell align="center">{category.name}</StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenEditModal(category)}
                        size="small"
                      >
                        Изменить
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        href={`/dashboard/good/good-category/${category._id}`}
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
            Новая товарная категория
          </Typography>

          <Stack>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Наименование"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newGoodCategory.name}
                onChange={(event) =>
                  setNewGoodCategory({ ...newGoodCategory, name: event.target.value })
                }
              />
            </FormControl>
          </Stack>

          <Stack>
            <Button
              variant="contained"
              color="success"
              size="small"
              disabled={!validForm()}
              onClick={createGoodCategoryClickHandler}
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
