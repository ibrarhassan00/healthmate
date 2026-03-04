import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/axios';

// ============================================
// Analyze File – Gemini Se Analysis Lo
// ============================================
export const analyzeFile = createAsyncThunk(
    'ai/analyze',
    async (fileId, thunkAPI) => {
        try {
            const res = await API.get(`/ai/analyze/${fileId}`);
            return res.data.insight;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);