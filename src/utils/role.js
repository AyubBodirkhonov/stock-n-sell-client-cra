export const RoleMessage = (roles) => {
  if (roles?.includes('FINANCE_MANAGER')) {
    return 'Финансовый менеджер';
  }

  if (roles?.includes('SUDO')) {
    return 'Системный админ';
  }

  return 'Пользователь';
}