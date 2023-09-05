import { useCallback, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { Helmet } from 'react-helmet-async';
import { ActivePassiveStatus, ActivePassiveStatusRu } from '../../dictionary/common.dict';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';
import axios from '../../../utils/axios';

export default function PageBlackList() {
  const [blackListItems, setBlackListItems] = useState([]);

  const getBlackList = useCallback(async () => {
    const blackListRes = await axios.get('admin/black-list', {
      headers: { authorization: localStorage.getItem('accessToken') },
    });

    if (blackListRes.data.success) {
      setBlackListItems(blackListRes.data.data);
    }
  }, []);

  useEffect(() => {
    getBlackList();
  }, [getBlackList]);

  /* STYLES */

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
  // Table styles >>>>>

  return (
    <>
      <Helmet>
        <title>Черный список</title>
      </Helmet>

      <Container>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 5 }}>
          <Typography variant="h3" component="h1" paragraph>
            Черный список
          </Typography>
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">#</StyledTableCell>
                  <StyledTableCell align="center">Айпи адрес</StyledTableCell>
                  <StyledTableCell align="center">Пользователь</StyledTableCell>
                  <StyledTableCell align="center">Создано</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {blackListItems.map((blackListItem, index) => (
                  <StyledTableRow key={blackListItem?._id}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">{blackListItem.ipAddress}</StyledTableCell>
                    <StyledTableCell align="center">
                      {blackListItem?.user?._id ? blackListItem?.user?.username : '<не найден>'}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {HHmmDDMMYYYY(blackListItem.createdAt)}
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
