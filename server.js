const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');

const connection = process.env.DATABASE;

const PORT = process.env.PORT || 5000;

mongoose
  .connect(connection)
  .then(() => {
    console.log('Connected to the database.');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});
