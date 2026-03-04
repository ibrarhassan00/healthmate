import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import cloudinary from '../config/cloudinary.js';
import sendEmail from '../utils/sendEmail.js';
import fs from 'fs'
// ============================================
// Helper Function – Token banao aur bhejo
// ============================================
const sendTokenResponse = (user, statusCode, res) => {

    // Step 1 – Token banao
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );

    // Step 2 – Cookie options
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 din
        httpOnly: true, // JS se access nahi hoga
    };

    // Step 3 – Password response mein mat bhejo
    user.password = undefined;

    // Step 4 – Cookie + Response bhejo
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user,
        });
};
// ============================================
// Register – Naya User Banao
// ============================================
const register = async (req, res) => {
    try {

        // Step 1 – Request se data lo
        const { name, email, password } = req.body;

        // Step 2 – Sab fields check karo
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Sab fields zaroor bharo! ❌',
            });
        }

        // Step 3 – Email pehle se exist karta hai?
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Yeh email pehle se registered hai! ❌',
            });
        }

        // Step 4 – Naya user banao
        const user = await User.create({
            name,
            email,
            password, // Model mein auto hash hoga
        });

        // Step 5 – Token bhejo
        sendTokenResponse(user, 201, res);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ============================================
// Login – User Login Karo
// ============================================
const login = async (req, res) => {
    try {

        // Step 1 – Request se data lo
        const { email, password } = req.body;

        // Step 2 – Sab fields check karo
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email aur password zaroor dalo! ❌',
            });
        }

        // Step 3 – User find karo password ke saath
        const user = await User.findOne({ email }).select('+password');

        // Step 4 – User mila ya nahi
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ya password galat hai! ❌',
            });
        }

        // Step 5 – Password check karo
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email ya password galat hai! ❌',
            });
        }

        // Step 6 – Token bhejo
        sendTokenResponse(user, 200, res);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ============================================
// Logout – User Logout Karo
// ============================================
const logout = async (req, res) => {
    try {

        // Cookie ko empty karke expire karo
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 5 * 1000), // 5 second mein expire
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: 'Logout ho gaye! 👋',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ============================================
// Forgot Password – OTP Bhejo Email Pe
// ============================================
// const forgotPassword = async (req, res) => {
//     let user;
//     try {

//         // Step 1 – Email lo request se
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Email zaroor dalo! ❌',
//             });
//         }

//         // Step 2 – User find karo
//         user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Yeh email registered nahi hai! ❌',
//             });
//         }

//         // Step 3 – OTP banao (6 digits)
//         const otp = crypto.randomInt(100000, 999999).toString();

//         // Step 4 – OTP hash karke DB mein save karo
//         user.resetPasswordOTP = crypto
//             .createHash('sha256')
//             .update(otp)
//             .digest('hex');

//         // Step 5 – OTP ki expiry set karo (10 minute)
//         user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//         await user.save();

//         // Step 6 – Email bhejo
//         const message = `
//             <h2>HealthMate Password Reset</h2>
//             <p>Tumhara OTP hai:</p>
//             <h1 style="color: blue;">${otp}</h1>
//             <p>Yeh OTP 10 minute mein expire ho jayega!</p>
//             <p>Agar tumne request nahi ki to ignore karo.</p>
//         `;

//         await sendEmail({
//             email: user.email,
//             subject: 'HealthMate Password Reset OTP',
//             message,
//         });

//         res.status(200).json({
//             success: true,
//             message: 'OTP email pe bhej diya! 📧',
//         });

//     } catch (error) {
//         // Error aaye to OTP fields reset karo
//         user.resetPasswordOTP = undefined;
//         user.resetPasswordExpire = undefined;
//         await user.save();

//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };
const forgotPassword = async (req, res) => {
    let user;
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email zaroor dalo! ❌',
            });
        }

        user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Yeh email registered nahi hai! ❌',
            });
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        user.resetPasswordOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        // ← yeh important hai — validation skip karo
        await user.save({ validateBeforeSave: false });

        console.log('Original OTP:', otp);
        console.log('DB mein save hua:', user.resetPasswordOTP);

        const message = `
            <h2>HealthMate Password Reset</h2>
            <p>Tumhara OTP hai:</p>
            <h1 style="color: blue;">${otp}</h1>
            <p>Yeh OTP 10 minute mein expire ho jayega!</p>
            <p>Agar tumne request nahi ki to ignore karo.</p>
        `;

        await sendEmail({
            email: user.email,
            subject: 'HealthMate Password Reset OTP',
            message,
        });

        res.status(200).json({
            success: true,
            message: 'OTP email pe bhej diya! 📧',
        });

    } catch (error) {
        if (user) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ============================================
// Reset Password – Naya Password Set Karo
// ============================================
const resetPassword = async (req, res) => {
    try {

        // Step 1 – OTP aur naya password lo
        const { otp, newPassword } = req.body;

        if (!otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'OTP aur naya password zaroor dalo! ❌',
            });
        }

        // Step 2 – Jo OTP aaya usse hash karo
        const hashedOTP = crypto
            .createHash('sha256')
            .update(otp)
            .digest('hex');

        // Step 3 – User find karo hashed OTP se
        // Aur check karo OTP expire tو nahi hua
        const user = await User.findOne({
            resetPasswordOTP: hashedOTP,
            resetPasswordExpire: { $gt: Date.now() }, // $gt = greater than
        });

        // Step 4 – User mila ya nahi
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP! ❌',
            });
        }

        // Step 5 – Naya password set karo
        user.password = newPassword;

        // Step 6 – OTP fields saaf karo
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Step 7 – Token bhejo
        sendTokenResponse(user, 200, res);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ============================================
// Update Password – Purana Password Badlo
// ============================================
const updatePassword = async (req, res) => {
    try {

        // Step 1 – Purana aur naya password lo
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Purana aur naya password zaroor dalo! ❌',
            });
        }

        // Step 2 – User find karo password ke saath
        const user = await User.findById(req.user.id).select('+password');

        // Step 3 – Purana password check karo
        const isPasswordMatch = await user.comparePassword(oldPassword);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Purana password galat hai! ❌',
            });
        }

        // Step 4 – Naya password same tو nahi purane se?
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: 'Naya password purane se alag hona chahiye! ❌',
            });
        }

        // Step 5 – Naya password save karo
        user.password = newPassword;
        await user.save();

        // Step 6 – Token bhejo
        sendTokenResponse(user, 200, res);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ============================================
// Update Profile – Name aur Email Badlo
// ============================================
   const updateProfile = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name zaroor dalo! ❌',
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name },
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Profile update ho gaya! ✅',
            user,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ============================================
// Profile Image Upload karo
// ============================================
const uploadProfileImage = async (req, res) => {
    try {

        // Step 1 – Image aayi ya nahi check karo
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image zaroor dalo! ❌',
            });
        }

        // Step 2 – User find karo
        const user = await User.findById(req.user.id);

        // Step 3 – Purani image hai to Cloudinary se hatao
        if (user.profileImage && user.profileImage.public_id) {
            await cloudinary.uploader.destroy(user.profileImage.public_id);
        }

        // Step 4 – Cloudinary pe upload karo (disk path se)
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'healthmate/profiles',
            width: 300,
            crop: 'scale',
        });

        // Step 5 – Local file delete karo
        fs.unlinkSync(req.file.path);

        // Step 6 – DB mein image save karo
        user.profileImage = {
            public_id: result.public_id,
            url: result.secure_url,
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile image upload ho gaya! ✅',
            user,
        });

    } catch (error) {
        // Error pe bhi local file delete karo
        if (req.file?.path) fs.unlinkSync(req.file.path);
        
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ============================================
// Get Me – Current User Lo (Cookie se)
// ============================================
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    updateProfile,
    uploadProfileImage,
    getMe,
}