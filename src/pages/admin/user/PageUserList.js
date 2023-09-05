import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';

import axios from '../../../utils/axios';
import { ActivePassiveStatus, ActivePassiveStatusRu } from '../../dictionary/common.dict';
import { HHmmDDMMYYYY } from '../../../utils/formatTime';

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

export default function PageUserList() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({});

  const getUsers = useCallback(async () => {
    const usersRes = await axios.get('/admin/user', {
      headers: { authorization: localStorage.getItem('accessToken') },
    });

    if (usersRes.data.success) {
      setUsers(usersRes.data.data);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const createNewUserHandler = async () => {
    try {
      const newUserReq = await axios.post('/admin/user', newUser, {
        headers: { authorization: localStorage.getItem('accessToken') },
      });

      if (newUserReq.data.success) {
        window.location.href = '/dashboard/admin/user';
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        <title>Пользователи</title>
      </Helmet>

      <Container>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 5 }}>
          <Typography variant="h3" component="h1" paragraph>
            Список пользователей
          </Typography>
          <Button variant="contained" size="small" sx={{ p: 2.5 }} href="user/create">
            + Добавить пользователя
          </Button>
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
                  <StyledTableCell align="center">Детали</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <StyledTableRow key={user?._id}>
                    <StyledTableCell component="th" scope="row" align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        color={user.status === ActivePassiveStatus.active ? 'success' : 'error'}
                      >
                        {ActivePassiveStatusRu[user.status]}
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">{user.username}</StyledTableCell>
                    <StyledTableCell align="center">{user.displayName}</StyledTableCell>
                    <StyledTableCell align="center">{HHmmDDMMYYYY(user.createdAt)}</StyledTableCell>
                    <StyledTableCell align="center">
                      <Button variant="outlined" color="success" href={`user/${user._id}`}>
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
