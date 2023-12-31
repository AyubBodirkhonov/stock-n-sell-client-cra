import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem } from '@mui/material';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import { CustomAvatar } from '../../../components/custom-avatar';
import { useSnackbar } from '../../../components/snackbar';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

const OPTIONS = [
  // {
  //   label: 'Домой',
  //   linkTo: '/',
  // },
  // {
  //   label: 'Профиль',
  //   linkTo: '/profile',
  // },
  // {
  //   label: 'Мои уведомления',
  //   linkTo: '/notification',
  // },
  // {
  //   label: 'Настройки',
  //   linkTo: '/settings',
  // },
];

const ADMIN_OPTIONS = [
  // {
  //   label: 'Домой',
  //   linkTo: '/',
  // },
  // {
  //   label: 'Профиль',
  //   linkTo: '/profile',
  // },
  // {
  //   label: 'Мои уведомления',
  //   linkTo: '/notification',
  // },
  {
    label: 'Пользователи',
    linkTo: '/dashboard/admin/user',
  },
  {
    label: 'Логи',
    linkTo: '/dashboard/admin/log',
  },
  {
    label: 'Черный список',
    linkTo: '/dashboard/admin/black-list  ',
  },
  // {
  //   label: 'Настройки',
  //   linkTo: '/settings',
  // },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();

  const { user, logout } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate(PATH_AUTH.login, { replace: true });
      handleClosePopover();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path) => {
    handleClosePopover();
    navigate(path);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpenPopover}
        sx={{
          p: 0,
          ...(openPopover && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <CustomAvatar src={user?.photoURL} alt={user?.displayName} name={user?.displayName} />
      </IconButtonAnimate>

      <MenuPopover open={openPopover} onClose={handleClosePopover} sx={{ width: 200, p: 0 }}>
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {user.roles.includes('SUDO') || user.roles.includes('ADMIN') ? (
          <Stack sx={{ p: 1 }}>
            {ADMIN_OPTIONS.map((option) => (
              <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
                {option.label}
              </MenuItem>
            ))}
          </Stack>
        ) : (
          <Stack sx={{ p: 1 }}>
            {OPTIONS.map((option) => (
              <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
                {option.label}
              </MenuItem>
            ))}
          </Stack>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Выйти
        </MenuItem>
      </MenuPopover>
    </>
  );
}
