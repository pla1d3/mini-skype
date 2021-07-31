import { Router } from 'express';
import { auth, users, chats, messages } from 'controlers';
import config from '../../config';

const publicRouter = Router();

publicRouter.get('/get-me', async (req, res)=> {
  const me = await auth.getMe(req.session);
  res.status(200).send(me);
});
publicRouter.post('/reg', (req, res)=> {
  auth.reg(req, res);
});
publicRouter.post('/login', (req, res)=> {
  auth.login(req, res);
});

// users
publicRouter.get('/users', async (req, res)=> {
  const data = await users.getList(req.query);
  res.status(200).send(data);
});
publicRouter.get('/users/:userId', async (req, res)=> {
  const data = await users.getItem({ userId: req.params.userId });
  res.status(200).send(data);
});
publicRouter.post('/users/contacts/add', async (req, res)=> {
  await users.addContact(req.body);
  res.status(200).send('ok');
});

// chats
publicRouter.get('/chat', async (req, res)=> {
  const data = await chats.getItem(req.query);
  res.status(200).send(data);
});
publicRouter.post('/chats/create', async (req, res)=> {
  const chatId = await chats.create(req.body);
  res.status(200).send(chatId);
});

// messages
publicRouter.get('/messages', async (req, res)=> {
  const data = await messages.getList(req.query);
  res.status(200).send(data);
});
publicRouter.post('/messages/create', async (req, res)=> {
  const messageId = await messages.create(req.body);
  res.status(200).send(messageId);
});

export default publicRouter;
