import redis from 'redis';
import * as controlers from 'controlers';

export default {
  // chats last messages,
  // chats count unread messages
  user: (client, req)=> {
    const rc = redis.createClient();
    const subscribe = rc.subscribe(`user-${req.session.userId}`);

    subscribe.on('message', (channel, message)=> client.send(message));

    client.on('close', ()=> {
      console.log('client close');
      subscribe.quit();
    });
  },

  messages: async (client, req)=> {
    const { chatId } = req.query;

    const sub = redis.createClient();
    sub.subscribe(`messages-${chatId}`);

    sub.on('message', (channel, message)=> {
      if (channel === `messages-${chatId}`) {
        console.log('client.send');
        client.send(message);
      }
    });

    client.on('close', ()=> {
      console.log('client close from chat');
      sub.quit();
    });

    const pub = redis.createClient();
    const messages = await controlers.messages.getList({ chatId });
    pub.publish(`messages-${chatId}`, JSON.stringify({
      type: 'set',
      data: messages
    }));
  }
};
