import redis from 'redis';
import * as controlers from 'controlers';

export default {
  // chats lastMessage
  // chats count unread messages
  chats: (client, req)=> {
    const { userId } = req.query;

    const sub = redis.createClient();
    sub.subscribe(`chats-${userId}`);

    sub.on('message', (channel, message)=> {
      if (channel === `chats-${userId}`) {
        client.send(message);
      }
    });

    client.on('close', ()=> {
      console.log('client close');
      sub.quit();
    });
  },

  messages: async (client, req)=> {
    const { chatId } = req.query;

    const sub = redis.createClient();
    sub.subscribe(`messages-${chatId}`);

    sub.on('message', (channel, message)=> {
      if (channel === `messages-${chatId}`) {
        client.send(message);
      }
    });

    client.on('close', ()=> {
      console.log('client close from chat');
      sub.quit();
    });

    const messages = await controlers.messages.getList({ chatId });
    client.send(JSON.stringify({
      type: 'set',
      data: messages
    }));
  }
};
