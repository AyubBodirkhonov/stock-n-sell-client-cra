// @mui
import { Stack, Typography, Link } from '@mui/material';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';
import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Вход</Typography>

        <Stack direction="row" spacing={0.5}>
          <Typography variant="body2">Новый пользователь?</Typography>

          <Link variant="subtitle2" href="https://t.me/ok_google99">
            Создать аккаунт
          </Link>
        </Stack>
      </Stack>

      <AuthLoginForm />

      <AuthWithSocial />
    </LoginLayout>
  );
}
