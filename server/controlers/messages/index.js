import { Message } from 'models';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export default {
  async create (data) {
    const message = new Message(data);
    await message.save();
    return message._id;
  },

  async getList (query = {}) {
    if (query.chatId) query.chatId = ObjectId(query.chatId)
    const messages = await Message.find(query).limit(10);
    return messages
  }
}
