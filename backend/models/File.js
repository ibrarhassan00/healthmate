import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({

    // Yeh file kis user ki hai
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID zaroor chahiye'],
    },

    // File ka naam
    fileName: {
        type: String,
        required: [true, 'File name zaroor chahiye'],
    },

    // File ka type (PDF ya Image)
    fileType: {
        type: String,
        enum: ['pdf', 'image'],
        required: [true, 'File type zaroor chahiye'],
    },

    // Report ka type
    reportType: {
        type: String,
        enum: [
            'blood_test',
            'xray',
            'ultrasound',
            'prescription',
            'other'
        ],
        required: [true, 'Report type zaroor chahiye'],
    },

    // Cloudinary details
    cloudinary: {
        public_id: String,
        url: String,
    },

    // Report ki date
    reportDate: {
        type: Date,
        required: [true, 'Report date zaroor chahiye'],
    },

    // Koi note likhna ho
    notes: {
        type: String,
        default: '',
    },

},
{
    timestamps: true,
});

export default mongoose.model('File', fileSchema);