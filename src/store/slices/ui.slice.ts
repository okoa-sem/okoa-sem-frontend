import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
  selectedSchoolId: string | null;
}

const initialState: UiState = {
  isSidebarOpen: false,
  theme: 'light',
  selectedSchoolId: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setSelectedSchoolId: (state, action: PayloadAction<string | null>) => {
      state.selectedSchoolId = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme, setSelectedSchoolId } = uiSlice.actions;

export default uiSlice.reducer;
