import { Router } from 'express';
import * as controlers from 'controlers';

const publicRouter = Router();

publicRouter.get('/get-me', async (req, res)=> {
  const user = await controlers.auth.getMe(req.session);
  res.status(200).send(user);
});
publicRouter.post('/reg', (req, res)=> {
  controlers.auth.reg(req, res);
});
publicRouter.post('/login', (req, res)=> {
  controlers.auth.login(req, res);
});

export default publicRouter;
