import mongoose from 'mongoose';
import redis from 'redis';
import { Chat } from 'models';
import * as controlers from 'controlers';

const ObjectId = mongoose.Types.ObjectId;

export default {
  async getList({ userId, chatId, userIds }) {
    const query = {};
    if (chatId) query._id = ObjectId(chatId);
    if (userId) query.userIds = { $in: [ObjectId(userId)] };
    if (userIds) query.userIds = { $all: userIds.map(userId=> ObjectId(userId)) };

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
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'chatId',
          as: 'messages'
        }
      },
      { $sort: { 'messages.createdAt': -1 } },
      { $addFields: { lastMessage: { $last: '$messages' } } },
      { $unset: ['messages', 'userIds', 'users.contactIds'] },
      { $sort: { 'lastMessage.createdAt': -1 } }
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

  async edit({ userId, chatId, ...data }) {
    const query = {};
    if (chatId) query._id = chatId;
    if (userId) query.userIds = { $in: [ObjectId(userId)] };

    if (data.unreadIds) data.unreadIds = data.unreadIds.map(userId=> ObjectId(userId));
    if (data.callIds) data.callIds = data.callIds.map(userId=> ObjectId(userId));
    const chat = await Chat.findOneAndUpdate(query, data);

    const pub = redis.createClient();
    for (let i = 0; i < chat.userIds.length; i++) {
      const userId = chat.userIds[i];
      const chats = await controlers.chats.getList({ userId });
      pub.publish(`chats-${userId}`, JSON.stringify({ type: 'set', data: chats }));
    }
    pub.quit();
  }
};
