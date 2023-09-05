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

import { useSnackbar } from 'notistack';
import Iconify from '../../../components/iconify/Iconify';
import StockOperationFilter from '../../../components/filter/stock-operation.filter';
import axios from '../../../utils/axios';
import { useSettingsContext } from '../../../components/settings';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import {
  SellOperationStatusEnum,
  SellOperationStatusRu,
} from '../../dictionary/sell-operation.dictionary';
import ExportToXlsx from '../../../utils/xlsx';

export default function PageStockOperation() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [operations, setOperations] = useState([]);
  const [searchInput, setSearchInput] = useState([]);
  const [filters, setFilters] = useState(false);
  const [filterOption, setFilterOption] = useState({
    status: '',
    startDate: '',
    good: '',
    stock: '',
    endDate: '',
    supplier: '',
  });

  const stockOperationData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/stock-operation/', {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          search: searchInput,
          ...filterOption,
        },
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

  useEffect(() => {
    stockOperationData();
  }, [stockOperationData]);

  const resetSearch = () => {
    setFilterOption({});
    setSearchInput('');
  };

  console.log({ filterOption });

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
    const tableId = 'purchase-operations-list';
    ExportToXlsx(tableId, 'Отчет по операцям по закупу');
  };

  return (
    <>
      <Helmet>
        <title>Склад операции</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Список склад операций</Typography>

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
            <Button onClick={resetSearch}>
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
            <Button
              variant="outlined"
              size="small"
              sx={{ p: 2.5, width: '50px' }}
              onClick={exportXlsx}
            >
              Excel
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ p: 2.5 }}
              href="/dashboard/operation/stock-operation/create"
            >
              + Добавить склад операцию
            </Button>
          </Stack>
        </Stack>
        <Stack direction="row" sx={{ mx: -3, display: !filters ? 'none' : 'block' }}>
          <StockOperationFilter filterOption={filterOption} setFilterOption={setFilterOption} />
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table
              id="purchase-operations-list"
              sx={{ minWidth: 700, borderRadius: '16px' }}
              aria-label="customized table"
            >
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">Дата</StyledTableCell>
                  <StyledTableCell align="center">Склад</StyledTableCell>
                  <StyledTableCell align="center">Поставщик</StyledTableCell>
                  <StyledTableCell align="center">Статус</StyledTableCell>
                  <StyledTableCell align="center">Общая сумма</StyledTableCell>
                  <StyledTableCell align="center">Действия</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {operations.map((operation) => (
                  <StyledTableRow key={operation._id}>
                    <StyledTableCell align="center">
                      {HHmmDDMMYYYY(operation.createdAt)}
                    </StyledTableCell>
                    <StyledTableCell align="center">{operation.stock?.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {operation.supplier?.companyName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color={
                          operation.status === SellOperationStatusEnum.conducted
                            ? 'success'
                            : 'warning'
                        }
                      >
                        {SellOperationStatusRu[operation.status]}
                      </Button>
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {operation.totalPrice.toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        href={`/dashboard/operation/stock-operation/${operation._id}`}
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
