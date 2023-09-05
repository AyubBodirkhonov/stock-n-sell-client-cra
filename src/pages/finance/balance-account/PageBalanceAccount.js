import { useCallback, useEffect, useState } from 'react';

import { Button, Container, Typography, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Helmet } from 'react-helmet-async';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useSnackbar } from 'notistack';
import { useSettingsContext } from '../../../components/settings';
import axios from '../../../utils/axios';
import { SnackbarMessage, SnackbarType } from '../../dictionary/snackbar-message.dictionary';
import { BackendErrorHandler } from '../../../utils/backend-error-handler';
import {
  BalanceAccountTypeEnum,
  BalanceAccountTypeEnumRu,
} from '../../dictionary/balance-account.dictionary';
import Iconify from '../../../components/iconify';

// @mui

export default function BalanceAccount() {
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [balanceAccounts, setBalanceAccounts] = useState([]);
  const [filters, setFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filterOption, setFilterOption] = useState({
    type: null,
  });
  const balanceAccountData = useCallback(async () => {
    try {
      const response = await axios.get('/api/v1/balance-account/', {
        headers: { authorization: localStorage.getItem('accessToken') },
        params: {
          ...filterOption,
        },
      });
      console.log({ response });

      if (response.data.success) {
        setBalanceAccounts(response.data.data);
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
  }, [enqueueSnackbar, filterOption]);

  useEffect(() => {
    balanceAccountData();
  }, [balanceAccountData]);

  const resetSearch = () => {
    setSearchInput('');
    setFilterOption({});
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
        <title>Balance Account</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4">Список балансных счетов</Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          mb={{ xs: 2, md: '0' }}
          mt={2}
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
          </Stack>
        </Stack>
        <Stack direction="row" sx={{ mx: -3, display: !filters ? 'none' : 'block' }}>
          <FormControl sx={{ ml: 3, width: { md: '20%', xl: '25%' } }} size="small">
            <InputLabel id="demo-select-small-label">Тип</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="StatusFilter"
              value={filterOption.type}
              onChange={(event) => setFilterOption({ ...filterOption, type: event.target.value })}
            >
              <MenuItem value="">-</MenuItem>
              <MenuItem value={BalanceAccountTypeEnum.supplier}>
                {BalanceAccountTypeEnumRu.supplier}
              </MenuItem>
              <MenuItem value={BalanceAccountTypeEnum.client}>
                {BalanceAccountTypeEnumRu.client}
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '15px' }}>
          <TableContainer>
            <Table aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align="center">Тип счета</StyledTableCell>
                  <StyledTableCell align="center">Номер счета</StyledTableCell>
                  <StyledTableCell align="center">Клиент/Поставщик</StyledTableCell>
                  <StyledTableCell align="center">Баланс</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {balanceAccounts.map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">
                      <Button variant="outlined" size="small">
                        {BalanceAccountTypeEnumRu[item.type?.toLowerCase()]}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">{item._id}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        href={
                          item.type === 'SUPPLIER'
                            ? `/dashboard/dict/supplier/${item.supplier?._id}`
                            : `/dashboard/dict/client/${item.client?._id}`
                        }
                      >
                        {item.type === 'SUPPLIER'
                          ? item.supplier?.companyName
                          : item.client?.companyName}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {item.balanceAmount?.toLocaleString()}
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
