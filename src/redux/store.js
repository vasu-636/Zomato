import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';

// Use createWebStorage for Vite ESM compatibility
const createNoopStorage = () => ({
  getItem: (_key) => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: (_key) => Promise.resolve(),
});

const storage =
  typeof window !== 'undefined'
    ? window.localStorage
      ? {
          getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
          setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
          removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
        }
      : createNoopStorage()
    : createNoopStorage();
import authReducer from './authSlice';

const persistConfig = {
  key: 'zomato-partner',
  storage,
  whitelist: ['auth'], // only persist auth
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these redux-persist action types
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
});

export const persistor = persistStore(store);
