import mongoose from 'mongoose';
import { Chat } from 'models';

const ObjectId = mongoose.Types.ObjectId;

export default {
  async getList({ chatId, userIds }) {
    const query = {};
    if (chatId) query._id = ObjectId(chatId);
    if (userIds) query.userIds = { $in: userIds.map(userId=> ObjectId(userId)) };

    const chats = await Chat.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          let: { ids: '$userIds' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$ids'] } } }
          ],
          as: 'users'
        }
      },
      { $unset: ['users.chats', 'users.contacts'] }
    ]);

    return chats;
  },

  async getItem({ chatId, userIds }) {
    const chats = await this.getList({ chatId, userIds });
    return chats[0];
  },

  async create({ type, userIds }) {
    userIds = userIds.map(userId=> ObjectId(userId));

    const chat = new Chat({ type, userIds });
    await chat.save();

    return chat._id;
  },

  async update() {
    // Model.update({_id: id}, obj, {upsert: true, setDefaultsOnInsert: true}, cb);
  }
};
