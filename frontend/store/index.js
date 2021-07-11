import { observable } from 'mobx';

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