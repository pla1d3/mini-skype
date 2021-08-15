import { Schema, connection } from 'mongoose';

const messageSchema = new Schema({
  userId: { type: Schema.ObjectId, require: true },
  chatId: { type: Schema.ObjectId, require: true },
  text: { type: String, require: true }
}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false }
});

export default connection.model('message', messageSchema);
