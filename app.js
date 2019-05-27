const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const trackingRoutes = require('./routes/tracking');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/tracking', trackingRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message, status: status });
});

mongoose
  .connect(
    'mongodb+srv://romantibuai:edgarjunior@cluster0-rw3fu.mongodb.net/tracking?retryWrites=true'
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
