const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/keys');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bucketListItemRoutes = require('./routes/api/bucketListItems');
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log(err));

app.use('/api/bucketListItems', bucketListItemRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, 'client', 'dist', 'index.html'));
  });
}

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
