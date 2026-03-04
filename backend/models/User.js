import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name zaroor dalo'],
    },
    email: {
        type: String,
        required: [true, 'Email zaroor dalo'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password zaroor dalo'],
        minlength: 6,
        select: false, // password kabhi response mein nahi aayega
    },
    profileImage: {
        public_id: String,  // Cloudinary ka ID
        url: String,        // Image ka link
    },
    resetPasswordOTP: String,       // Forgot password OTP
    resetPasswordExpire: Date,      // OTP ki expiry
},
{
    timestamps: true, // createdAt, updatedAt auto banayega
});

// Password save hone se pehle hash karo
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10);
    
});

// Password compare karne ka method
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);

