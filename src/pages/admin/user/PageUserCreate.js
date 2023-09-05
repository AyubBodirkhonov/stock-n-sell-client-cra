import { Helmet } from 'react-helmet-async';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  OutlinedInput,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from '../../../utils/axios';
import { UserRoleDict } from '../../dictionary/user.dict';

export default function PageUserCreate() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    displayName: '',
    password: '',
    passwordRepeat: '',
    roles: [],
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const saveHandler = async () => {
    setButtonDisabled(() => true);
    const userRes = await axios.post('/admin/user', user, {
      headers: { authorization: localStorage.getItem('accessToken') },
    });

    if (userRes.data.success) {
      navigate('/dashboard/admin/user');
    }
  };

  const onRoleAddRemoveClick = (event) => {
    if (user.roles.includes(event.target.value)) {
      user.roles = user.roles.filter((role) => role !== event.target.value);
    } else {
      user.roles.push(event.target.value);
    }

    setUser({ ...user, roles: user.roles });
  };

  const validForm = () => {
    let valid = false;

    if (
      user.password === user.passwordRepeat &&
      user.roles.length &&
      user.username &&
      user.displayName &&
      !buttonDisabled
    ) {
      valid = true;
    }
    return valid;
  };

  return (
    <>
      <Helmet>
        <title>Пользователь</title>
      </Helmet>

      <Container>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 5 }}>
          <Typography variant="h3" component="h1" paragraph>
            Новый пользователь
          </Typography>
        </Stack>

        <Box
          component="form"
          sx={{
            overflow: 'hidden',
            borderRadius: '16px',
            maxWidth: '100%',
            width: '1084px',
            '& > :not(style)': { m: 1 },
            margin: '0 auto',
            boxShadow:
              'rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px;',
          }}
          p={2}
          mt={5}
          noValidate
          autoComplete="off"
        >
          {/* Given */}
          <Stack
            direction={{ xs: 'column', sm: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
          >
            <FormControl>
              <InputLabel htmlFor="outlined-adornment-amount">Имя пользователя</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                label="username"
                type="text"
                value={user.username}
                onChange={(event) => {
                  setUser({
                    ...user,
                    username: event.target.value,
                  });
                }}
                sx={{ width: 220 }}
              />
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="outlined-adornment-amount">Дисплей нейм</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                label="display-name"
                type="text"
                value={user.displayName}
                onChange={(event) => {
                  setUser({
                    ...user,
                    displayName: event.target.value,
                  });
                }}
                sx={{ width: 220 }}
              />
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="outlined-adornment-amount">Пароль</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                label="Пароль"
                type="password"
                value={user.password}
                onChange={(event) => {
                  setUser({
                    ...user,
                    password: event.target.value,
                  });
                }}
                sx={{ width: 220 }}
              />
            </FormControl>

            <FormControl>
              <InputLabel htmlFor="outlined-adornment-amount">Пароль (введите еще раз)</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                label="Пароль"
                type="password"
                value={user.passwordRepeat}
                onChange={(event) => {
                  setUser({
                    ...user,
                    passwordRepeat: event.target.value,
                  });
                }}
                sx={{ width: 220 }}
              />
            </FormControl>
          </Stack>

          <Stack
            justifyContent="space-between"
            direction={{ xs: 'column', sm: 'column', md: 'row' }}
          >
            <FormGroup
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '15px',
              }}
            >
              {UserRoleDict.map(
                (role, index) =>
                  (index + 1) % 3 === 1 && (
                    <Tooltip key={index} title={role.description} placement="bottom-start">
                      <FormControlLabel
                        control={<Checkbox onClick={onRoleAddRemoveClick} value={role.value} />}
                        label={role.name}
                      />
                    </Tooltip>
                  )
              )}
            </FormGroup>
            <FormGroup
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '15px',
              }}
            >
              {UserRoleDict.map(
                (role, index) =>
                  (index + 1) % 3 === 2 && (
                    <Tooltip key={index} title={role.description} placement="bottom-start">
                      <FormControlLabel
                        control={<Checkbox onClick={onRoleAddRemoveClick} value={role.value} />}
                        label={role.name}
                      />
                    </Tooltip>
                  )
              )}
            </FormGroup>
            <FormGroup
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '15px',
              }}
            >
              {UserRoleDict.map(
                (role, index) =>
                  (index + 1) % 3 === 0 && (
                    <Tooltip key={index} title={role.description} placement="bottom-start">
                      <FormControlLabel
                        control={<Checkbox onClick={onRoleAddRemoveClick} value={role.value} />}
                        label={role.name}
                      />
                    </Tooltip>
                  )
              )}
            </FormGroup>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              sx={{ width: '100%' }}
              disabled={!validForm()}
              onClick={saveHandler}
            >
              Сохранить
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
