import { observable } from 'mobx';
import { qs } from 'helpers';

const store = observable({});

export const getStore = storeName=> {
  if (!store[storeName]) {
    store[storeName] = {
      data: null,
      set: function(data) {
        this.data = data;
      }
    };
  }
  return store[storeName];
};

export const getSocket = (storeName, params = {})=> {
  if (!store[storeName]) {
    const url = new URL(`ws://localhost:9000/${storeName}`);
    url.search = qs.stringify(params);

    const ws = new WebSocket(url.toString());
    ws.onopen = ()=> console.log(`ws ${storeName} open`);
    ws.onclose = ()=> console.log(`ws ${storeName} close`);
    ws.onmessage = e=> {
      const message = JSON.parse(e.data);

      if (message.type === 'set') {
        store[storeName].data = message.data;
      }

      if (message.type === 'push') {
        console.log(message.data);
        store[storeName].data.push(message.data);
        store[storeName].data = [...store[storeName].data];
      }
    };

    store[storeName] = {
      ws,
      data: null,
      set: function(data) {
        this.data = data;
      }
    };
  }
  return store[storeName];
};
