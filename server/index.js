import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import socket from 'socket.io';
import redisAdapter from 'socket.io-redis';
import { serverPort } from 'config';
import routers from './routers';
import { session } from './middlewares';

const app = express();
const server = createServer(app);
const io = socket(server);
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

app
  .use(session)
  .use('/res', express.static(__dirname + '/res'))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(cors({
    credentials: true,
    origin: ['http://localhost:3000']
  }))
  .use('/api/v1/', routers.public);

io.on('connection', ()=> {
  // routers
  console.log('a user connected');
});

server.listen(serverPort, ()=> {
  console.log(`server start on ${serverPort} port`);
  // cronAuto.start();
});
