import { createSlice } from '@reduxjs/toolkit';
import {
    addVitals,
    getAllVitals,
    updateVitals,
    deleteVitals,
} from './vitalsAPI';

// ============================================
// Initial State
// ============================================
const initialState = {
    vitals: [],          // Sare vitals ki list
    loading: false,
    error: null,
    successMessage: null,
};

// ============================================
// Vitals Slice
// ============================================
const vitalsSlice = createSlice({
    name: 'vitals',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.successMessage = null;
        },
    },

    extraReducers: (builder) => {

        // ---- Add Vitals ----
        builder
        .addCase(addVitals.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addVitals.fulfilled, (state, action) => {
            state.loading = false;
            state.vitals.unshift(action.payload); // Nayi entry list mein add karo
            state.successMessage = 'Vitals added successfully!';
        })
        .addCase(addVitals.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Get All Vitals ----
        .addCase(getAllVitals.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllVitals.fulfilled, (state, action) => {
            state.loading = false;
            state.vitals = action.payload;
        })
        .addCase(getAllVitals.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Update Vitals ----
        .addCase(updateVitals.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateVitals.fulfilled, (state, action) => {
            state.loading = false;
            // Updated vitals ko list mein replace karo
            state.vitals = state.vitals.map((v) =>
                v._id === action.payload._id ? action.payload : v
            );
            state.successMessage = 'Vitals updated successfully!';
        })
        .addCase(updateVitals.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Delete Vitals ----
        .addCase(deleteVitals.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteVitals.fulfilled, (state, action) => {
            state.loading = false;
            // Deleted vitals ko list se hatao
            state.vitals = state.vitals.filter((v) => v._id !== action.payload);
            state.successMessage = 'Vitals deleted successfully!';
        })
        .addCase(deleteVitals.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    },
});

export const { clearError, clearMessage } = vitalsSlice.actions;
export default vitalsSlice.reducer;