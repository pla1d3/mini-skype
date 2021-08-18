import { Router } from 'express';
import * as controlers from 'controlers';

const publicRouter = Router();

publicRouter.post('/reg', (req, res)=> {
  controlers.auth.reg(req, res);
});
publicRouter.post('/login', (req, res)=> {
  controlers.auth.login(req, res);
});

export default publicRouter;
