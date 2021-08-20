import mongoose from 'mongoose';
import redis from 'redis';
import { Message, Chat } from 'models';
import * as controlers from 'controlers';

const ObjectId = mongoose.Types.ObjectId;

export default {
  async getList({ messageId, userId, chatId }) {
    const query = {};
    if (messageId) query._id = ObjectId(messageId);
    if (chatId) query.chatId = ObjectId(chatId);
    if (userId) query.userId = ObjectId(userId);

    const messages = await Message
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $unset: ['user.contactIds'] }
      ])
      .sort({ createdAt: -1 })
      .limit(10);

    return messages;
  },

  async create(data) {
    const newMessage = new Message(data);
    await newMessage.save();

    // push to WebSocket
    const pub = redis.createClient();

    const messages = await this.getList({ chatId: data.chatId });
    pub.publish(`messages-${data.chatId}`, JSON.stringify({
      type: 'set',
      data: messages
    }));

    const chat = await Chat.findById(data.chatId);
    await controlers.chats.edit({
      chatId: data.chatId,
      unreadIds: chat.userIds
    });

    for (let i = 0; i < chat.userIds.length; i++) {
      const userId = chat.userIds[i];
      const chats = await controlers.chats.getList({ userId });
      pub.publish(`chats-${userId}`, JSON.stringify({ type: 'set', data: chats }));
    }

    pub.quit();
  }
};
