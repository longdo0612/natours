const path = require('path');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const toursRoute = require('./routes/tours');
const usersRoute = require('./routes/users');
const reviewsRoute = require('./routes/reviews');
const bookingRoute = require('./routes/bookings');
const bookingController = require('./controllers/bookingController');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.options('*', cors());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use(express.static(path.join(__dirname, 'public')));

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);

app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());
app.use(compression());

app.get('/', (req, res, next) => {
  res.status(200).send('App is working');
});

app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/reviews', reviewsRoute);
app.use('/api/v1/bookings', bookingRoute);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use(globalErrorHandler);

module.exports = app;
