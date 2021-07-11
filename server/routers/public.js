import { Router } from 'express';
import { auth, users } from 'controlers';
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
  const data = await users.getList({ query: req.query });
  res.status(200).send(data);
});
publicRouter.get('/users/:userId', async (req, res)=> {
  const data = await users.getItem({ userId: req.params.userId });
  res.status(200).send(data);
});
publicRouter.post('/users/contacts/add', async (req, res)=> {
  await users.addContact(req.body);
  res.status(200).send('ok');
})

export default publicRouter;
