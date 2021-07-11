import mongoose from 'mongoose';
import sesion from 'express-session';
import { maxAgeCokie, secretKey } from 'config';
const MongoSesionStore = require('connect-mongo')(sesion);

export default sesion({
  store: new MongoSesionStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions'
  }),
  secret: secretKey,
  resave: true,
  rolling: true,
  saveUninitialized: true,
  cookie: {
    maxAge: maxAgeCokie,
    path: '/',
    httpOnly: true,
    secure: false
  }
});
