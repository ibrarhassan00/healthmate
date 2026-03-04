import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import filesReducer from '../features/files/filesSlice';
import aiReducer from '../features/ai/aiSlice';
import vitalsReducer from '../features/vitals/vitalsSlice';
// ============================================
// Redux Store – Poori app ka central data store
// ============================================

// Sochlo yeh ek bada dabba hai
// Jisme sari app ki state rakhi hai
const store = configureStore({
    reducer: {
        auth: authReducer,  // Baad mein files, vitals, ai bhi add honge
        files: filesReducer, // ← add karo
        ai: aiReducer, // ← add karo
        vitals: vitalsReducer, // ← add karo
    },
});

export default store;