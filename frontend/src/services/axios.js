import axios from 'axios';

// ============================================
// Axios Instance – Ek baar setup, har jagah use
// ============================================

// Yeh ek custom axios banata hai
// Ab har request mein baseURL automatic lagegi
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Backend ka address
    withCredentials: true,               // Cookie automatically jayegi har request mein
});

export default API;


