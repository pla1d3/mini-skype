import { Schema, connection } from 'mongoose';

const messageSchema = new Schema({
  userId: { type: Schema.ObjectId, require: true },
  chatId: { type: Schema.ObjectId, require: true },
  text: { type: String, require: true },
  dateCreate: {
    type: Number,
    require: true
  }
});

export default connection.model('message', messageSchema);
