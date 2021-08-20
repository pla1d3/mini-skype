import mongoose from 'mongoose';
import { User } from 'models';

const ObjectId = mongoose.Types.ObjectId;

export default {
  async getList({ login, excludeIds }) {
    const query = {};
    if (login) query.login = { $regex: '^' + login, $options: 'i' };
    if (excludeIds) query._id = { $nin: excludeIds.map(userId=> ObjectId(userId)) };

    const users = await User.find(query).limit(10);
    return users;
  },

  async getItem({ userId }) {
    const user = await User.findById(userId);
    return user;
  },

  async addContact({ userId, contactId }) {
    await User.update({ _id: userId },
      { $push: { contactIds: ObjectId(contactId) }
      });
  }
};
