import { createSlice } from '@reduxjs/toolkit';
import { analyzeFile } from './aiAPI';

// ============================================
// Initial State
// ============================================
const initialState = {
    insight: null,    // AI ka analysis result
    loading: false,
    error: null,
};

// ============================================
// AI Slice
// ============================================
const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        clearInsight: (state) => {
            state.insight = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {

        // ---- Analyze File ----
        builder
        .addCase(analyzeFile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(analyzeFile.fulfilled, (state, action) => {
            state.loading = false;
            state.insight = action.payload; // AI insight save karo
        })
        .addCase(analyzeFile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    },
});

export const { clearInsight, clearError } = aiSlice.actions;
export default aiSlice.reducer;