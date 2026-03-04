import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv"

dotenv.config()


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
// ```

// ### Yeh kya kar raha hai? 🤔
// - `.env` se Cloudinary keys le raha hai
// - Cloudinary configure kar raha hai
// - `module.exports` → bahar use karne ke liye

// ---

// ## Cloudinary Account banao 🌐

// 1. Jao 👉 **cloudinary.com**
// 2. Free account banao
// 3. Dashboard pe yeh 3 cheezein copy karo:
// ```
// Cloud Name  → CLOUDINARY_NAME
// API Key     → CLOUDINARY_API_KEY
// API Secret  → CLOUDINARY_API_SECRET
// ```

// 4. `.env` mein paste karo

// ---

// ## Gmail App Password banao 📧

// 1. Gmail account kholo
// 2. **Google Account Settings** jao
// 3. **Security** → **2-Step Verification** ON karo
// 4. Phir **App Passwords** dhundo
// 5. New app password banao → copy karo
// 6. `.env` mein paste karo:
// ```
// GMAIL_USER=tumhari@gmail.com
// GMAIL_PASS=xxxx xxxx xxxx xxxx