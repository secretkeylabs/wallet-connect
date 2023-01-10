var store = require("store");
export const saveToLocalStorage = (key, item) => {
  try {
    store.set(key, item);
  } catch (e) {
    console.error(e);
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const stateStr = store.get(key);
    return stateStr ? stateStr : undefined;
  } catch (e) {
    return undefined;
  }
};

export const clearLocalStorage = () => {
  try {
    store.clearAll();
  } catch (e) {
    console.error(e);
  }
};
