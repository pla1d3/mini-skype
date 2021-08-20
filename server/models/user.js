import { Schema, connection } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, require: true },
  login: { type: String, require: true },
  password: {
    type: String,
    require: true,
    select: false
  },
  lastActiveAt: { type: Date, require: true },
  name: { type: String, require: true },
  contactIds: { type: [Schema.ObjectId] },
  avatarUrl: String
}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false }
});

export default connection.model('user', userSchema);
