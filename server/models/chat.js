import { Schema, connection } from 'mongoose';

const chatSchema = new Schema({
  type: { type: String, require: true },
  title: { type: String, require: true },
  userIds: { type: [], require: true },
  unreadIds: { type: [], require: true },
  callIds: { type: [], require: true }
}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false }
});

export default connection.model('chat', chatSchema);
