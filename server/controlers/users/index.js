import { User } from 'models';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export default {
  async getList ({ query = {} }) {
    const _query = {};

    if (query.login) _query.login = { $regex: '^' + query.login, $options: 'i' };
    if (query.excludeIds) _query._id = { $ne: query.excludeIds };

    const users = await User.find(_query).limit(10);
    return users;
  },

  async getItem ({ userId }) {
    const user = await User.findById(userId);
    return user;
  },

  async addContact ({ userId, contactId }) {
    await User.update(
      { _id: userId },
      { $push: { contacts: ObjectId(contactId) } }
    );
  }
}
