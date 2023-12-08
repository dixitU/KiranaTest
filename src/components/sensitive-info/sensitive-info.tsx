import SInfo from 'react-native-sensitive-info';

const options = {
  sharedPreferencesName: 'KiranaTest',
  keychainService: '$KiranaTest@123$',
};

export const setItem = (key: string, value: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      await SInfo.setItem(key, value, options);
      resolve(null);
    } catch (e) {
      reject(e);
    }
  });
};

export const getItem = (key: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await SInfo.getItem(key, options);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};

export function removeItem(key: string) {
  return new Promise(async (resolve, reject) => {
    try {
      await SInfo.deleteItem(key, options);
      resolve(null);
    } catch (err) {
      reject(err);
    }
  });
}
