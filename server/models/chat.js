import { Schema, connection } from 'mongoose';

const chatSchema = new Schema({
  _id: String,
  userIds: [],
  title: String,
  type: String
});

export default connection.model('chat', chatSchema);
