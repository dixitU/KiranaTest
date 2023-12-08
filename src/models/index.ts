import {types, Instance} from 'mobx-state-tree';
import React, {createContext} from 'react';

const News = types
  .model({
    title: types.optional(types.string, ''),
    description: types.optional(types.string, ''),
    urlToImage: types.optional(types.string, ''),
    publishedAt: types.optional(types.string, ''),
    view: types.optional(types.number, 0),
    pin: types.optional(types.number, 0),
  })
  .actions((self: any) => ({
    updateView() {
      if (self.pin !== 1) {
        self.view = 1;
      }
    },
    newsPin() {
      self.view = 0;
      self.pin = 1;
    },
  }));

export const rootStore = types
  .model({
    news: types.array(News),
  })
  .actions((self: any) => ({
    setNews(news: any) {
      self.news = news;
    },
    deleteNews(title: any) {
      const filtered = self.news.filter((e: any) => e.title !== title);
      self.news = filtered;
    },
  }))
  .create({
    news: [],
  });

const RootStoreContext = createContext<null | Instance<typeof rootStore>>(null);

export function useStore() {
  const store = React.useContext(RootStoreContext);
  // if (store === (null || undefined)) {
  //   console.log('it is working');
  //   throw new Error('Store cannot be null, please add a context provider');
  // }
  return store;
}

export const StoreProvider = RootStoreContext.Provider;
