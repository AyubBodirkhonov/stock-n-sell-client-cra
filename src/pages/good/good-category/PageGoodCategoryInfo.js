import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Container, Divider, Grid, Stack, Typography } from '@mui/material';

import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import CircularProgress from '@mui/material/CircularProgress';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Helmet } from 'react-helmet-async';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';

import { SellOperationStatusRu } from '../../dictionary/sell-operation.dictionary';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import axios from '../../../utils/axios';
import { useSettingsContext } from '../../../components/settings';
import { ConfirmDialog } from '../../../components/dialog/confirm-dialog';

export default function PageGoodCategoryInfo() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [category, setCategory] = useState({});
  const [categoryGoods, setCategoryGoods] = useState([]);

  const getDicts = useCallback(async () => {
    try {
      const [categoryRes, categoryGoodsRes] = await Promise.all([
        axios.get(`/api/v1/good-category/${id}`, {
          headers: { authorization: localStorage.getItem('accessToken') },
        }),
        axios.get(`/api/v1/good`, {
          headers: { authorization: localStorage.getItem('accessToken') },
          params: {
            category: id,
          },
        }),
      ]);

      if (categoryRes.data.success && categoryGoodsRes.data.success) {
        setCategory(categoryRes.data.data);
        setCategoryGoods(categoryGoodsRes.data.data);
      } else {
        enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(categoryRes.data.error[0])], {
          variant: SnackbarType.error,
        });
      }
    } catch (e) {
      enqueueSnackbar(SnackbarMessage.error[BackendErrorHandler(e.message)], {
        variant: SnackbarType.error,
      });
    }
  }, [id, enqueueSnackbar]);

  useEffect(() => {
    getDicts();
  }, [getDicts]);

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
  console.log({ category });
  return (
    <>
      <Helmet>
        <title>Good Category</title>
      </Helmet>

      <ConfirmDialog
        // action={''}
        open={open}
        handleClose={handleClose}
        title="Удаление товарной категории"
        description="Вы уверены что хотите удалить товарную категорию? При удаление категории могут возникнуть проблемы с операциями с участием этой категории товаров! Проверьте еще раз на наличие операций, если операций нет, то всё хорошо"
      />

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={2}>
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
              <Typography variant="h6" color="primary">
                Базовая информация
              </Typography>
              <Divider width="100%" />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '700px' }}
              >
                <Typography variant="subtitle2">
                  <strong>Категория</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {category.name}
                  </Typography>
                </Stack>
              </Stack>
              <Divider width="100%" light />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ width: '700px' }}
              >
                <Typography variant="subtitle2">
                  <strong>ID</strong>
                </Typography>
                <Stack sx={{ width: '300px' }}>
                  <Typography variant="body2" sx={{ color: 'rgb(108, 115, 127)' }}>
                    {category._id}
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
                      <StyledTableCell align="center">Товар</StyledTableCell>
                      <StyledTableCell align="center">Общий Остаток</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {categoryGoods.map((good, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">
                          {HHmmDDMMYYYY(good.createdAt)}
                        </StyledTableCell>
                        <StyledTableCell align="center">{good.name}</StyledTableCell>
                        <StyledTableCell align="center">
                          {good.leftAmount?.toLocaleString()}
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
