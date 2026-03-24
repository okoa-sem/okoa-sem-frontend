import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatbotState {
  selectedSessionId: string | null;
  searchKeyword: string;
  activeSessionsCount: number | null;
  isLoadingCount: boolean;
  loadedSessionsCount: number; // Track number of sessions loaded locally
}

const initialState: ChatbotState = {
  selectedSessionId: null,
  searchKeyword: '',
  activeSessionsCount: null,
  isLoadingCount: false,
  loadedSessionsCount: 0,
};

export const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    setSelectedSessionId: (state, action: PayloadAction<string | null>) => {
      state.selectedSessionId = action.payload;
    },
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload;
    },
    setActiveSessionsCount: (state, action: PayloadAction<number>) => {
      state.activeSessionsCount = action.payload;
      state.isLoadingCount = false;
    },
    setIsLoadingCount: (state, action: PayloadAction<boolean>) => {
      state.isLoadingCount = action.payload;
    },
    setLoadedSessionsCount: (state, action: PayloadAction<number>) => {
      state.loadedSessionsCount = action.payload;
    },
    resetChatbot: (state) => {
      state.selectedSessionId = null;
      state.searchKeyword = '';
      state.activeSessionsCount = null;
      state.isLoadingCount = false;
      state.loadedSessionsCount = 0;
    },
  },
});

export const {
  setSelectedSessionId,
  setSearchKeyword,
  setActiveSessionsCount,
  setIsLoadingCount,
  setLoadedSessionsCount,
  resetChatbot,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
