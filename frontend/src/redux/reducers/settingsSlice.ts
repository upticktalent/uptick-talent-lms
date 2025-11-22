import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  lang: string; 
}

const initialState: SettingsState = {
  lang: process.env.NEXT_PUBLIC_DEFAULT_LANG || 'en', 
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
    },
  },
});

export const settingsActions = { ...settingsSlice.actions };
export const settingsReducer = settingsSlice.reducer;