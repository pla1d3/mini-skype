import { Schema, connection } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, require: true },
  login: { type: String, require: true },
  password: {
    type: String,
    require: true,
    select: false
  },
  name: String,
  avatarUrl: String,
  lastVisit: Number,
  contacts: [],
  chats: []
}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false }
});

export default connection.model('user', userSchema);
