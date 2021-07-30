import { Schema, connection } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, require: true },
  login: { type: String, require: true },
  password: { type: String, require: true },
  name: String,
  avatarUrl: String,
  lastVisit: Number,
  dateReg: {
    type: String,
    default: ()=> new Date().getTime(),
    require: true
  },
  contacts: [],
  chats: []
});

export default connection.model('user', userSchema);
