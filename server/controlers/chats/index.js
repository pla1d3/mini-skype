import { Chat } from 'models';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export default {
  async getItem (query) {
    let chat = null;

    if (query.type === 'private') {
      query.userIds = query.userIds.map(userId => ObjectId(userId));

      const data = await Chat.aggregate([
        { $match: { userIds: query.userIds } },
        {
          $lookup: {
            'from': 'users',
            'let': { 'ids': '$userIds' },
            'pipeline': [
              { '$match': { '$expr': { '$in': ['$_id', '$$ids'] } } }
            ],
            'as':'users'
          }
        },
        { $unset: ['__v', 'users.password', 'users.__v', 'users.chats', 'users.contacts'] }
      ]);

      if (data.length) {
        chat = data[0];
        chat.toUser = chat.users.find(user => user._id !== query.fromId);
        delete chat.users;
      }
    }

    return chat;
  },

  async create (data) {
    data.userIds = data.userIds.map(userId => ObjectId(userId));

    const chat = new Chat(data);
    await chat.save();

    return chat._id;
  }
}
