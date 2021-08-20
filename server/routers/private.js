import { Router } from 'express';
import * as controlers from 'controlers';
import { isAuth } from '../middlewares';

const privateRouter = Router();
privateRouter.use(isAuth);

// users
privateRouter.get('/get-me', async (req, res)=> {
  const user = await controlers.auth.getMe({
    userId: req.session.userId
  });
  return res.status(200).send(user);
});
privateRouter.get('/users', async (req, res)=> {
  const users = await controlers.users.getList(req.query);
  res.status(200).send(users);
});
privateRouter.get('/users/:userId', async (req, res)=> {
  const user = await controlers.users.getItem({
    ...req.params,
    ...req.query
  });
  res.status(200).send(user);
});
privateRouter.post('/users/contacts/add', async (req, res)=> {
  await controlers.users.addContact(req.body);
  res.status(200).send('ok');
});

// chats
privateRouter.get('/chats', async (req, res)=> {
  const chats = await controlers.chats.getList(req.query);
  res.status(200).send(chats);
});
privateRouter.get('/chats/:chatId', async (req, res)=> {
  const chat = await controlers.chats.getItem({
    ...req.params,
    ...req.query
  });
  res.status(200).send(chat);
});
privateRouter.post('/chats/create', async (req, res)=> {
  const chatId = await controlers.chats.create(req.body);
  res.status(200).send(chatId);
});
privateRouter.post('/chats/:chatId/edit', async (req, res)=> {
  await controlers.chats.edit({
    ...req.params,
    ...req.body
  });
  res.status(200).send('ok');
});

// messages
privateRouter.get('/messages', async (req, res)=> {
  const messages = await controlers.messages.getList(req.query);
  res.status(200).send(messages);
});
privateRouter.post('/messages/create', async (req, res)=> {
  const messageId = await controlers.messages.create(req.body);
  res.status(200).send(messageId);
});

export default privateRouter;
