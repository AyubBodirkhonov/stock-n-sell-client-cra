import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Container, Stack, TableCell, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import axios from '../../../utils/axios';

export default function PageUserInfo() {
  const { id } = useParams();
  const [user, setUser] = useState({});

  const getUser = useCallback(async () => {
    const userRes = await axios.get(`/admin/user/${id}`, {
      headers: { authorization: localStorage.getItem('accessToken') },
    });

    if (userRes.data.success) {
      setUser(userRes.data.data);
    }
  }, [id]);

  useEffect(() => {
    getUser();
  }, [getUser]);

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
            Информация о пользователе
          </Typography>
        </Stack>
      </Container>
    </>
  );
}
