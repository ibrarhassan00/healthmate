import File from '../models/File.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// ============================================
// Upload File – Report Upload Karo
// ============================================
const uploadFile = async (req, res) => {
    try {

        // Step 1 – File aayi ya nahi
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File zaroor dalo! ❌',
            });
        }

        // Step 2 – Body se data lo
        const { reportType, reportDate, notes } = req.body;

        if (!reportType || !reportDate) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Report type aur date zaroor dalo! ❌',
            });
        }

        // Step 3 – File type check karo
        const mimetype = req.file.mimetype;
        let fileType;

        if (mimetype === 'application/pdf') {
            fileType = 'pdf';
        } else if (mimetype.startsWith('image/')) {
            fileType = 'image';
        } else {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Sirf PDF ya Image upload karo! ❌',
            });
        }

        // Step 4 – Cloudinary pe upload karo
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'healthmate/reports',
            resource_type: 'auto',
        });

        // Step 5 – Local file delete karo
        fs.unlinkSync(req.file.path);

        // Step 6 – DB mein save karo
        const file = await File.create({
            userId: req.user.id,
            fileName: req.file.originalname,
            fileType,
            reportType,
            reportDate,
            notes,
            cloudinary: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });

        res.status(201).json({
            success: true,
            message: 'File upload ho gayi! ✅',
            file,
        });

    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// ============================================
// Get All Files – Sari Files Lo
// ============================================
const getAllFiles = async (req, res) => {
    try {

        const files = await File.find({ userId: req.user.id })
                                .sort({ reportDate: -1 }); // Nayi pehle

        res.status(200).json({
            success: true,
            count: files.length,
            files,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================
// Get One File – Ek File Ki Detail Lo
// ============================================
const getOneFile = async (req, res) => {
    try {

        // Step 1 – File find karo
        const file = await File.findById(req.params.id);

        // Step 2 – File mili ya nahi
        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File nahi mili! ❌',
            });
        }

        // Step 3 – Yeh file is user ki hai?
        if (file.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Yeh tumhari file nahi hai! ❌',
            });
        }

        res.status(200).json({
            success: true,
            file,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================
// Delete File – File Delete Karo
// ============================================
const deleteFile = async (req, res) => {
    try {

        // Step 1 – File find karo
        const file = await File.findById(req.params.id);

        // Step 2 – File mili ya nahi
        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File nahi mili! ❌',
            });
        }

        // Step 3 – Yeh file is user ki hai?
        if (file.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Yeh tumhari file nahi hai! ❌',
            });
        }

        // Step 4 – Cloudinary se delete karo
       await cloudinary.uploader.destroy(file.cloudinary.public_id, {
    resource_type: file.fileType === 'pdf' ? 'raw' : 'image',
});

        // Step 5 – DB se delete karo
        await file.deleteOne();

        res.status(200).json({
            success: true,
            message: 'File delete ho gayi! ✅',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { 
    uploadFile, 
    getAllFiles, 
    getOneFile, 
    deleteFile 
};