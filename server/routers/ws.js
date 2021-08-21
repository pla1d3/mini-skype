import redis from 'redis';
import * as controlers from 'controlers';

export default {
  chats: async (client, req)=> {
    console.log('client connected');
    const { userId } = req.query;

    const sub = redis.createClient();
    sub.subscribe(`chats-${userId}`);

    client.on('message', message=> {
      const _message = JSON.parse(message);

      if (_message.type.includes('call-')) {
        const pub = redis.createClient();
        pub.publish(`chats-${_message.toUserId}`, JSON.stringify({
          ..._message.data,
          isMeta: true
        }));
        pub.quit();
      }
    });

    sub.on('message', (channel, message)=> {
      if (channel === `chats-${userId}`) {
        client.send(message);
      }
    });

    client.on('close', async ()=> {
      console.log('client close');
      await controlers.chats.edit({ userId, callIds: [] });
      sub.quit();
    });

    const chats = await controlers.chats.getList({ userId });
    client.send(JSON.stringify({
      type: 'set',
      data: chats
    }));
  },

  messages: async (client, req)=> {
    console.log('client join in chat');
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
