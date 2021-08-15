import mongoose from 'mongoose';
import redis from 'redis';
import { Message, User } from 'models';

const ObjectId = mongoose.Types.ObjectId;

export default {
  async getList({ chatId }) {
    const query = {};
    if (chatId) query.chatId = ObjectId(chatId);

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
        { $unwind: '$user' }
      ])
      .sort({ createdAt: 1 })
      .limit(10);

    return messages;
  },

  async create(data) {
    const message = new Message(data);
    await message.save();

    const [user] = await User.find({ _id: ObjectId(data.userId) });

    const pub = redis.createClient();
    pub.publish(`messages-${data.chatId}`, JSON.stringify({
      type: 'push',
      data: { ...message._doc, user }
    }));
  }
};
