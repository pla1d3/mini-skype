import { Schema, connection } from 'mongoose';

const chatSchema = new Schema({
  type: String,
  title: String,
  userIds: [],
  unreadIds: []
}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false }
});

export default connection.model('chat', chatSchema);
