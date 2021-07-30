import { Chat } from 'models';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export default {
  async getItem ({ chatId }) {
    let [chat] = await Chat.aggregate([
      { $match: { _id: chatId } },
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
      { $unset: ['users.password', 'users.__v', 'users.chats', 'users.contacts'] }
    ])

    if (!chat) {
      const userIds = chatId.split('__')

      chat = new Chat({
        _id: chatId,
        type: 'private',
        userIds: userIds.map(userId => ObjectId(userId))
      })
      await chat.save()
    }

    return chat;
  },
}
