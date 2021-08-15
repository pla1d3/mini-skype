import express from 'express';
import cors from 'cors';
import { serverPort } from 'config';
import routers from './routers';
import { session } from './middlewares';
import ws from 'express-ws';

const app = express();
ws(app);

app
  .use(session)
  .use('/res', express.static(__dirname + '/res'))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
  }))
  .use('/api/v1/', routers.public)
  .use('/api/v1/', routers.private)
  .ws('/user/', routers.ws.user)
  .ws('/messages/', routers.ws.messages);

app.listen(serverPort, ()=> {
  console.log(`server start on ${serverPort} port`);
});
