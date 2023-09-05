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
import axios from '../../../utils/axios';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';

export default function PageLogList() {
  const [logs, setLogs] = useState([]);

  const getLogs = useCallback(async () => {
    const logsRes = await axios.get('/admin/auth-log', {
      headers: { authorization: localStorage.getItem('accessToken') },
    });

    if (logsRes.data.success) {
      setLogs(logsRes.data.data);
    }
  }, []);

  useEffect(() => {
    getLogs();
  }, [getLogs]);

  function deletePasswordFromReqBody(reqBody) {
    const copy = JSON.parse(JSON.stringify(reqBody));
    delete copy.password;

    return copy;
  }

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
        <title>Логи</title>
      </Helmet>

      <Container>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 5 }}>
          <Typography variant="h3" component="h1" paragraph>
            Список логов
          </Typography>
        </Stack>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">#</StyledTableCell>
                  <StyledTableCell align="center">Статус</StyledTableCell>
                  <StyledTableCell align="center">Имя пользователя</StyledTableCell>
                  <StyledTableCell align="center">Имя дисплея</StyledTableCell>
                  <StyledTableCell align="center">Создано</StyledTableCell>
                  <StyledTableCell align="center">Тело запроса</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log, index) => (
                  <StyledTableRow key={log?._id}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        color={log.success ? 'success' : 'error'}
                      >
                        {log.success ? 'Успешно' : 'Ошиюка'}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">{log.ipAddress}</StyledTableCell>
                    <StyledTableCell align="center">
                      {log?.user ? log.user.username : ' '}
                    </StyledTableCell>
                    <StyledTableCell align="center">{HHmmDDMMYYYY(log.createdAt)}</StyledTableCell>
                    <StyledTableCell align="center">
                      {JSON.stringify(deletePasswordFromReqBody(log.requestBody))}
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
