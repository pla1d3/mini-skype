import { Schema, connection } from 'mongoose';

const chatSchema = new Schema({
  userIds: [],
  title: String,
  type: String
});

export default connection.model('chat', chatSchema);
