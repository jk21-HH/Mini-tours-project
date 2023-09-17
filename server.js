const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection. Shut down');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const LOCAL_DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(LOCAL_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection succesful');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection. Shut down');
  server.close(() => {
    process.exit(1);
  });
});
