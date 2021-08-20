import { Schema, connection } from 'mongoose';

const messageSchema = new Schema({
  text: { type: String, require: true },
  userId: { type: Schema.ObjectId, require: true },
  chatId: { type: Schema.ObjectId, require: true },
  viewerIds: { type: [Schema.ObjectId], require: true }
}, {
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: false }
});

export default connection.model('message', messageSchema);
