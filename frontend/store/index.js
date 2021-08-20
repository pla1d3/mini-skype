import { observable } from 'mobx';
import { qs } from 'helpers';
import _get from 'lodash/get';
import _clone from 'lodash/clone';

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
  if (store[storeName]?.ws) store[storeName].ws.close();

  const url = new URL(`ws://localhost:9000/${storeName}`);
  url.search = qs.stringify(params);

  store[storeName] = {
    data: null,
    set: function(data) {
      this.data = data;
    },
    ws: new WebSocket(url.toString())
  };

  store[storeName].ws.onopen = ()=> console.log(`ws ${storeName} open`);
  store[storeName].ws.onclose = ()=> console.log(`ws ${storeName} close`);
  store[storeName].ws.onmessage = e=> {
    const message = JSON.parse(e.data);

    if (message.type === 'set') {
      store[storeName].data = message.data;
    }

    if (message.type === 'push') {
      const array = message.path
        ? _get(store[storeName].data, message.path)
        : store[storeName].data;

      array.push(message.data);
      store[storeName].data = _clone(store[storeName].data);
    }
  };

  return store[storeName];
};
