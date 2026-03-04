import { createSlice } from '@reduxjs/toolkit';
import { 
    registerUser, 
    loginUser, 
    logoutUser,
    forgotPassword,
    resetPassword,
    updatePassword,
    updateProfile,
    uploadProfileImage,
    getMe
} from './authAPI';

// ============================================
// Initial State
// ============================================
const initialState = {
    user: null,          // Login ke baad user object
    loading: false,      // Request chal rahi hai?
    error: null,         // Koi error?
    successMessage: null // Forgot/Reset password ka message
};

// ============================================
// Auth Slice
// ============================================
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Error manually clear karna ho to
        clearError: (state) => {
            state.error = null;
        },
        // Success message clear karna ho to
        clearMessage: (state) => {
            state.successMessage = null;
        },
    },

    extraReducers: (builder) => {

        // ---- Register ----
        builder
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Login ----
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.successMessage = 'Login successful!'; 
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Logout ----
        .addCase(logoutUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
        })
        .addCase(logoutUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Forgot Password ----
        .addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload; // "OTP bhej diya"
        })
        .addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Reset Password ----
        .addCase(resetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(resetPassword.fulfilled, (state, action) => {
          state.loading = false;
    state.user = action.payload;                        // ← user save karo
    state.successMessage = 'Password reset successful!'; // ← hardcode karo
        })
        .addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Update Password ----
        .addCase(updatePassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePassword.fulfilled, (state, action) => {
            state.loading = false;
            state.successMessage = action.payload;
        })
        .addCase(updatePassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Update Profile ----
        .addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload; // Updated user
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // ---- Upload Profile Image ----
        .addCase(uploadProfileImage.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(uploadProfileImage.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload; // Updated user with image
        })
        .addCase(uploadProfileImage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
   
// ---- Get Me ----
.addCase(getMe.pending, (state) => {
    state.loading = true;
})
.addCase(getMe.fulfilled, (state, action) => {
    state.loading = false;
    state.user = action.payload; // User restore ho gaya
})
.addCase(getMe.rejected, (state) => {
    state.loading = false;
    state.user = null; // Cookie invalid hai
})
    
    
    },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;