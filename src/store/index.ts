import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/ui.slice';
import youtubeReducer from '@/features/youtube/slices/youtube.slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      youtube: youtubeReducer,
    },
  });
};

// Inspect the type of our store
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
