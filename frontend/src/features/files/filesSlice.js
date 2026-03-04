import { createSlice } from '@reduxjs/toolkit';
import {
    uploadFile,
    getAllFiles,
    getOneFile,
    deleteFile,
} from './filesAPI';

// ============================================
// Initial State
// ============================================
const initialState = {
    files: [],          // Sari files ki list
    currentFile: null,  // Ek file ki detail
    loading: false,
    error: null,
    successMessage: null,
};

// ============================================
// Files Slice
// ============================================
const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.successMessage = null;
        },
        clearCurrentFile: (state) => {
            state.currentFile = null;
        },
    },

    extraReducers: (builder) => {

        // ---- Upload File ----
        builder
        .addCase(uploadFile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(uploadFile.fulfilled, (state, action) => {
            state.loading = false;
            state.files.unshift(action.payload); // Nayi file list mein add karo
            state.successMessage = 'Report uploaded successfully!';
        })
        .addCase(uploadFile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Get All Files ----
        .addCase(getAllFiles.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllFiles.fulfilled, (state, action) => {
            state.loading = false;
            state.files = action.payload;
        })
        .addCase(getAllFiles.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Get One File ----
        .addCase(getOneFile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getOneFile.fulfilled, (state, action) => {
            state.loading = false;
            state.currentFile = action.payload;
        })
        .addCase(getOneFile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Delete File ----
        .addCase(deleteFile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteFile.fulfilled, (state, action) => {
            state.loading = false;
            // List mein se deleted file hatao
            state.files = state.files.filter(
                (file) => file._id !== action.payload
            );
            state.successMessage = 'Report deleted successfully!';
        })
        .addCase(deleteFile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    },
});

export const { clearError, clearMessage, clearCurrentFile } = filesSlice.actions;
export default filesSlice.reducer;