import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/axios';

// ============================================
// Upload File
// ============================================
export const uploadFile = createAsyncThunk(
    'files/upload',
    async (formData, thunkAPI) => {
        try {
            const res = await API.post('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // File upload ke liye
                },
            });
            return res.data.file;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// ============================================
// Get All Files
// ============================================
export const getAllFiles = createAsyncThunk(
    'files/getAll',
    async (_, thunkAPI) => {
        try {
            const res = await API.get('/files/all');
            return res.data.files;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// ============================================
// Get One File
// ============================================
export const getOneFile = createAsyncThunk(
    'files/getOne',
    async (id, thunkAPI) => {
        try {
            const res = await API.get(`/files/${id}`);
            return res.data.file;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// ============================================
// Delete File
// ============================================
export const deleteFile = createAsyncThunk(
    'files/delete',
    async (id, thunkAPI) => {
        try {
            await API.delete(`/files/${id}`);
            return id; // Deleted file ka id return karo
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);