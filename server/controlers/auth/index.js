import Joi from '@hapi/joi';
import md5 from 'md5';
import { secretKey, hostUrl } from 'config';
import { randomString } from 'helpers';
// import { mailer } from '../../services';
import mongoose from 'mongoose';
import { User } from 'models';
import FileType from 'file-type';
import path from 'path';
import fs from 'fs';

const ObjectId = mongoose.Types.ObjectId;

export default {
  async getMe(session) {
    if (session.isAuth) {
      const [user] = await User.aggregate([
        { $match: { _id: ObjectId(session.userId) } },
        {
          $lookup: {
            'from': 'users',
            'let': { 'cid': '$contacts' },
            'pipeline': [
              { '$match': { '$expr': { '$in': ['$_id', '$$cid'] } } }
            ],
            'as':'contacts'
          }
        }
      ])

      return user;
    }

    return false;
  },

  async login(req, res) {
    try {
      let { password } = req.body;
      const { email } = req.body;
      if (!email || !password) {
        return res.status(400).send({ error: 'need more data (email, password)' });
      }

      password = md5(password);

      console.log(email, password)
      const user = await User.findOne({ email, password },
        { password: 0, confirmHash: 0, __v: 0 });

      if (!user) {
        return res.send({ error: 'Пользователь не существует!' });
      }

      req.session.isAuth = true;
      req.session.userId = user._id;
      res.status(200).send(user);
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  },

  logout(req, res) {
    req.session.isAuth = false;
    delete req.session.userId;
    res.status(200).send('ok');
  },

  async reg(req, res) {
    try {
      let { login, email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send({ error: 'need more data (email, password)' });
      }

      email = email.trim();
      const validEmail = Joi.string().email({ minDomainSegments: 2,
        tlds: { allow: false } }).validate(email);
      if (validEmail.error) return res.send({ error: 'Не валидный email' });

      let user = await User.findOne({ email });
      if (user) return res.send({ error: 'Пользователь уже существует' });

      user = await User.findOne({ login });
      if (user) login = login + '_' + randomString(4);

      password = md5(password);
      const confirmHash = md5(secretKey);

      // mailer.sendConfirmEmail(email, confirmHash);
      let newUser = new User({ login, email, password, confirmHash, isSetPassword: true });
      const userSave = await newUser.save();

      if (userSave) {
        req.session.isAuth = true;
        req.session.userId = userSave._id;

        newUser = newUser.toObject();
        delete newUser.password;
        delete newUser.__v;
        delete newUser.confirmHash;
        res.status(201).send(newUser);
      }
    } catch (err) {
      res.status(500).send({ error: err });
    };
  },

  async avatar(req, res) {
    if (req.is() === 'multipart/form-data') {
      const file = req.file;
      const fileType = await FileType.fromBuffer(file.buffer);
      const filename = `${randomString(4)}.${fileType.ext}`;

      const folderPath = path.join(__dirname, './res/ava/');
      const fullPath = path.join(folderPath, path.basename(filename));

      fs.writeFileSync(fullPath, Buffer.from(file.buffer, 'latin1'));

      const serverPath = `${hostUrl}res/ava/${filename}`;
      await User.updateOne({ _id: req.session.userId }, { avatar: serverPath });
      return res.send(serverPath);
    }

    res.status(404);
  },

  async forgot(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).send({ error: 'need more data (email)' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.send({ error: 'Пользователь с данным email не существует!' });
      }

      user.newPassCode = randomString(16);
      user.save();
      // mailer.sendNewPass(email, user.newPassCode);

      res.send('ok');
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

};
