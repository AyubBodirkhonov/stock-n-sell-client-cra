import {
  Container,
  Stack,
  Typography,
  Grid,
  Card,
  Button,
  Box,
  styled,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useSettingsContext } from '../components/settings';
// import of images
import financePng from '../assets/backgound/finance.png';
import backgroundSvg from '../assets/backgound/hello.svg';
import hrmPng from '../assets/backgound/hrm.png';
import stockPng from '../assets/backgound/stock.png';
import purchasePng from '../assets/backgound/purchase.png';

import { useAuthContext } from '../auth/useAuthContext';

const cardStyles = {
  display: 'flex',
  p: 4,
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  gap: '15px',
};

const boxStyles = {
  display: 'block',
  backgroundColor: '#00AB55',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '15px',
};

const StyledCard = styled(Card)(cardStyles);

export default function HomePage() {
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Главная страница</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={2}>
          <Grid item md={12}>
            <Card
              sx={{
                p: 4,
                display: 'flex',
                backgroundColor: 'rgba(0, 167, 111, 0.08)',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="column" spacing={3}>
                <Typography variant="h4" component="h4" sx={{ color: 'rgb(0, 75, 80);' }}>
                  С возвращением, {user.displayName}!
                </Typography>
                <Typography variant="p" component="p" sx={{ color: 'rgb(0, 75, 80);' }}>
                  Откройте для себя возможности нашего приложения. Упростите себе жизнь, повысьте
                  производительность. Будьте организованы, оставайтесь на высоте. Достигайте
                  большего вместе с нами!
                </Typography>
                <Button
                  variant="contained"
                  sx={{ width: { xs: '20%' }, marginTop: '20px' }}
                  onClick={() => navigate('/dashboard')}
                >
                  Перейти
                </Button>
              </Stack>
              <Box
                sx={{
                  width: { lg: '100%', xl: '50%' },
                  marginTop: '10px',
                  display: { xs: 'none', lg: 'block' },
                }}
                mt={2}
              >
                <img src={backgroundSvg} alt="backgroundHome" />
              </Box>
            </Card>
          </Grid>

          {/* Home Page Cards */}

          <Grid item xs={12} md={6}>
            <StyledCard sx={cardStyles}>
              <Box sx={boxStyles} />
              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <img src={financePng} alt="fiancesvg" />
                <Typography variant="h5">Сбыт</Typography>
              </Stack>

              <Typography variant="p">Управление сбыт-операциями Бизнеса.</Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ width: '25%', marginTop: '10px' }}
                onClick={() => {
                  navigate('/dashboard/operation');
                }}
              >
                ПЕРЕЙТИ
              </Button>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <StyledCard sx={cardStyles}>
              <Box sx={boxStyles} />
              <Stack
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <img src={stockPng} alt="fiancesvg" />
                <Typography variant="h5" sx={{ position: 'relative', zIndex: 1 }}>
                  Склад
                </Typography>
              </Stack>
              <Typography variant="p">Управление складом Бизнеса.</Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ width: '25%', marginTop: '10px' }}
                onClick={() => {
                  navigate('/dashboard/storehouse/stock');
                }}
              >
                ПЕРЕЙТИ
              </Button>
            </StyledCard>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5">Новости</Typography>
              <Divider />

              <Stack>
                <Typography mt={2} variant="h6">
                  Добавлено:
                </Typography>
                <Typography variant="h7">
                  - Создание словарей (Товары, Товарные Категории, Клиенты, Поставщики); <br />
                  - Функции админа; <br />
                  - Операции по продаже и закупу; <br />
                  - Склад-операции - склады и трансферы товаров между складами; <br />
                  - Балансные счета между клиентами и поставщикам; <br />
                  - Дневные отчеты по продаже;
                  <br /> - Формирование отчетов по операциям (печатные формы);
                  <br />- Детали о товарнах категориях, клиентах, поставщиках;
                  <br />- Информационная карта по фильтрованным операциям.
                </Typography>
              </Stack>

              <Stack>
                <Typography mt={2} variant="h6">
                  В процессе:
                </Typography>
                <Typography variant="h7">
                  <br />
                  - Аналитика по операциям;
                  <br />- Пагинация и Филтры.
                  {/* - Система уведомлений пользователя о финансовых транзакциях; <br/> */}
                </Typography>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
