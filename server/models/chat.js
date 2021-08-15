import { Schema, connection } from 'mongoose';

const chatSchema = new Schema({
  userIds: [],
  title: String,
  type: String
}, {
  versionKey: false
});

export default connection.model('chat', chatSchema);
