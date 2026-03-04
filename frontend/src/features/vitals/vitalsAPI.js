import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/axios';

// ============================================
// Add Vitals
// ============================================
export const addVitals = createAsyncThunk(
    'vitals/add',
    async (formData, thunkAPI) => {
        try {
            const res = await API.post('/vitals/add', formData);
            return res.data.vitals;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// ============================================
// Get All Vitals
// ============================================
export const getAllVitals = createAsyncThunk(
    'vitals/getAll',
    async (_, thunkAPI) => {
        try {
            const res = await API.get('/vitals/all');
            return res.data.vitals;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// ============================================
// Update Vitals
// ============================================
export const updateVitals = createAsyncThunk(
    'vitals/update',
    async ({ id, formData }, thunkAPI) => {
        try {
            const res = await API.put(`/vitals/${id}`, formData);
            return res.data.vitals;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// ============================================
// Delete Vitals
// ============================================
export const deleteVitals = createAsyncThunk(
    'vitals/delete',
    async (id, thunkAPI) => {
        try {
            await API.delete(`/vitals/${id}`);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);  