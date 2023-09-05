import { useState, useEffect, useCallback } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Helmet } from 'react-helmet-async';

import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';
import SellOperationFilter from '../../../components/filter/sell-operation.filter';
import Iconify from '../../../components/iconify/Iconify';
import axios from '../../../utils/axios';
import { useSettingsContext } from '../../../components/settings';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';
import { SellOperationStatusRu } from '../../dictionary/sell-operation.dictionary';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import ExportToXlsx from '../../../utils/xlsx';

// import of images

export default function PageSellOperation() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [operations, setOperations] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState(false);
  const [filterOption, setFilterOption] = useState({
    status: '',
    client: '',
    startDate: '',
    endDate: '',
    good: '',
  });

  const sellOperationData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/sell-operation/', {
        params: {
          search: searchInput,
          ...filterOption,
        },
        headers: { authorization: localStorage.getItem('accessToken') },
      });

      if (response.data.success) {
        setOperations(response.data.data);
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
  }, [searchInput, filterOption, enqueueSnackbar]);

  console.log(operations);

  useEffect(() => {
    sellOperationData();
  }, [sellOperationData]);

  const resetSearch = () => {
    setFilterOption({});
    setSearchInput('');
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
    const tableId = 'sell-operation-list';
    ExportToXlsx(tableId, 'Отчет по операцям по продаже');
  };

  return (
    <>
      <Helmet>
        <title>Сбыт операция</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Сбыт операция</Typography>

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
            <Button
              onClick={() => {
                resetSearch();
              }}
            >
              <Iconify icon="pajamas:retry" />
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
            <Button
              variant="contained"
              size="small"
              href="/dashboard/operation/sell-operation/create"
              sx={{ p: 2.5 }}
            >
              + Добавить продажу
            </Button>
          </Stack>
        </Stack>
        <Stack direction="row" sx={{ mx: -3, display: !filters ? 'none' : 'block' }}>
          <SellOperationFilter filterOption={filterOption} setFilterOption={setFilterOption} />
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table
              id="sell-operation-list"
              sx={{ minWidth: 700, borderRadius: '16px' }}
              aria-label="customized table"
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Дата</StyledTableCell>
                  <StyledTableCell align="center">Клиент</StyledTableCell>
                  <StyledTableCell align="center">Статус</StyledTableCell>
                  <StyledTableCell align="center">Сумма сделки</StyledTableCell>
                  <StyledTableCell align="center">Действия</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {operations.map((operation, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">
                      {HHmmDDMMYYYY(operation.createdAt)}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {operation.client?.companyName}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        color={
                          // eslint-disable-next-line no-nested-ternary
                          operation.status.toLowerCase() === 'approved'
                            ? 'secondary'
                            : // eslint-disable-next-line no-nested-ternary
                            operation.status.toLowerCase() === 'conducted'
                            ? 'primary'
                            : operation.status.toLowerCase() === 'cancelled'
                            ? 'error'
                            : 'warning'
                        }
                      >
                        {SellOperationStatusRu[operation.status]}
                        {operation.status.toLowerCase() === 'pending' ? (
                          <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />
                        ) : (
                          ''
                        )}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {operation.totalPrice.toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        href={`/dashboard/operation/sell-operation/${operation._id}`}
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
    </>
  );
}
