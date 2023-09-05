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
import { Container, Typography, Modal, Box, FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { Helmet } from 'react-helmet-async';
import { useSnackbar } from 'notistack';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Iconify from '../../../components/iconify/Iconify';
import axios from '../../../utils/axios';
import { useSettingsContext } from '../../../components/settings';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import ExportToXlsx from '../../../utils/xlsx';
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

export default function PageGood() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [goods, setGoods] = useState([]);
  const [goodCats, setGoodCats] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [newGood, setNewGood] = useState({ name: '', category: '' });
  const [filterOption, setFilterOption] = useState({
    category: '',
  });
  const [filters, setFilters] = useState(false);

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const goodData = useCallback(async () => {
    try {
      const [goodRes, goodCategoriesRes] = await Promise.all([
        await axios.get('/api/v1/good', {
          params: {
            search: searchInput,
            ...filterOption,
          },
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
        await axios.get('/api/v1/good-category', {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
      ]);

      if (goodRes.data.success && goodCategoriesRes.data.success) {
        setGoods(goodRes.data.data);
        setGoodCats(goodCategoriesRes.data.data);
      } else {
        enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(goodRes.data.error[0])], {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e)], {
        variant: SnackbarType.error,
      });
    }
  }, [enqueueSnackbar, filterOption, searchInput]);

  useEffect(() => {
    goodData();
  }, [goodData]);

  const handleOpenEditModal = (good) => {
    setNewGood(good);
    // setOpenEditModal(true);
    setOpen(true);
    console.log(newGood);
  };

  const resetSearch = () => {
    setSearchInput('');
    setFilterOption({});
  };

  const createGoodClickHandler = async () => {
    setButtonDisabled(() => true);
    try {
      if (newGood._id) {
        // update logic
        const response = await axios.patch(`/api/v1/good/${newGood._id}`, newGood, {
          headers: { authorization: localStorage.getItem('accessToken') },
        });
        console.log({ response });

        if (response.data.success) {
          handleClose();
          goodData();
          enqueueSnackbar('Client information updated successfully', {
            variant: 'success',
          });
        }
      } else {
        // save logic
        const response = await axios.post('/api/v1/good', newGood, {
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

  const exportXlsx = () => {
    const tableId = 'good-list';
    ExportToXlsx(tableId, 'Товары');
  };

  return (
    <>
      <Helmet>
        <title>Товары</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Товары</Typography>

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
            <Button
              variant={filters ? 'contained' : 'outlined'}
              color="secondary"
              size="small"
              sx={{ p: 2.5 }}
              onClick={() => setFilters(!filters)}
            >
              Филтры
            </Button>
            <Button variant="outlined" size="small" sx={{ p: 2.5 }} onClick={exportXlsx}>
              Excel
            </Button>
            <Button variant="contained" size="small" onClick={handleOpen} sx={{ p: 2.5 }}>
              + Добавить товар
            </Button>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{ mx: -3, display: !filters ? 'none' : 'block' }}
          mb={2}
        >
          <FormControl sx={{ ml: 3, width: { md: '20%', xl: '25%' } }}>
            <InputLabel id="demo-select-small-label">Категория</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="FinanceFilter"
              value={filterOption.category}
              onChange={(event) =>
                setFilterOption({ ...filterOption, category: event.target.value })
              }
            >
              {goodCats.map((cat, index) => (
                <MenuItem value={cat._id} key={index}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table
              id="good-list"
              sx={{ minWidth: 700, borderRadius: '16px' }}
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">#</StyledTableCell>
                  <StyledTableCell align="center">Наименование</StyledTableCell>
                  <StyledTableCell align="center">Категория</StyledTableCell>
                  <StyledTableCell align="center">Остаток</StyledTableCell>
                  <StyledTableCell align="center">Действие</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goods.map((good, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">{index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{good.name}</StyledTableCell>
                    <StyledTableCell align="center">{good.category?.name}</StyledTableCell>
                    <StyledTableCell align="center">{good.leftAmount}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        onClick={() => handleOpenEditModal(good)}
                        size="small"
                      >
                        Изменить
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        href={`/dashboard/good/good/${good._id}`}
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
            Новый товар
          </Typography>

          <Stack>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }} size="small">
              <TextField
                id="outlined"
                label="Наименование"
                variant="outlined"
                sx={{ width: '100%' }}
                autoComplete="off"
                value={newGood.name}
                onChange={(event) => setNewGood({ ...newGood, name: event.target.value })}
              />
            </FormControl>
            <FormControl sx={{ m: 1, ml: 2, minWidth: 100, minHeight: 50 }}>
              <InputLabel id="demo-select-small-label">Категория товара</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                label="Good filter"
                value={newGood.category}
                onChange={(event) => {
                  setNewGood({ ...newGood, category: event.target.value });
                }}
              >
                <MenuItem value="">-</MenuItem>
                {goodCats.map((category, index) => (
                  <MenuItem value={category._id} key={index}>
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
              onClick={createGoodClickHandler}
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
