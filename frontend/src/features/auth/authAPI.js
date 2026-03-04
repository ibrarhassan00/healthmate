import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/axios';

// Register
export const registerUser = createAsyncThunk(
    'auth/register',
    async (formData, thunkAPI) => {
        try {
            const res = await API.post('/auth/register', formData);
            return res.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// Login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (formData, thunkAPI) => {
        try {
            const res = await API.post('/auth/login', formData);
            return res.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// Logout
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            await API.post('/auth/logout');
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, thunkAPI) => {
        try {
            const res = await API.post('/auth/forgot-password', { email });
            return res.data.message;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// Reset Password
export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (formData, thunkAPI) => {
        try {
            const res = await API.post('/auth/reset-password', formData);
            return res.data.message;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// Update Password
export const updatePassword = createAsyncThunk(
    'auth/updatePassword',
    async (formData, thunkAPI) => {
        try {
            const res = await API.put('/auth/update-password', formData);
            return res.data.message;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// Update Profile
export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (formData, thunkAPI) => {
        try {
            const res = await API.put('/auth/update-profile', formData);
            return res.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// Upload Profile Image
export const uploadProfileImage = createAsyncThunk(
    'auth/uploadProfileImage',
    async (formData, thunkAPI) => {
        try {
            const res = await API.put('/auth/upload-image', formData);
            return res.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);

// Get Me – Page refresh pe user restore karo
export const getMe = createAsyncThunk(
    'auth/getMe',
    async (_, thunkAPI) => {
        try {
            const res = await API.get('/auth/me');
            return res.data.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message);
        }
    }
);