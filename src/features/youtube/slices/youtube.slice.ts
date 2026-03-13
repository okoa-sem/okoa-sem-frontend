import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface YouTubeState {
	query: string;
	pageToken?: string;
}

const initialState: YouTubeState = {
	query: 'latest javascript trends',
	pageToken: undefined,
};

const youtubeSlice = createSlice({
	name: 'youtube',
	initialState,
	reducers: {
		setQuery: (state, action: PayloadAction<string>) => {
			state.query = action.payload;
			state.pageToken = undefined; // Reset page token on new query
		},
		setPageToken: (state, action: PayloadAction<string | undefined>) => {
			state.pageToken = action.payload;
		},
	},
});

export const { setQuery, setPageToken } = youtubeSlice.actions;
export default youtubeSlice.reducer;
