import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/ui.slice';
import youtubeReducer from '@/features/youtube/slices/youtube.slice';
import chatbotReducer from '@/features/chatbot/slices/chatbot.slice';
import websocketReducer from '@/features/chatbot/slices/websocket.slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      youtube: youtubeReducer,
      chatbot: chatbotReducer,
      websocket: websocketReducer,
    },
  });
};

// Inspect the type of our store
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

