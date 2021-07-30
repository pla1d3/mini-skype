import bluebird from 'bluebird';
import mongoose from 'mongoose';
import { mongoUrl } from 'config';

mongoose.connect(mongoUrl, { useNewUrlParser: true,
  useUnifiedTopology: true });
mongoose.connection.on('open', ()=> {
  console.log('mongo connected');
});
mongoose.connection.on('error', err=> {
  console.log('mongo error');
  console.error(err);
});
mongoose.Promise = bluebird;

export { default as User } from './user';
export { default as Chat } from './chat';
