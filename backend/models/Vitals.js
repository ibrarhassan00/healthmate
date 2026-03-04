import mongoose from 'mongoose';

const vitalsSchema = new mongoose.Schema({

    // Yeh vitals kis user ke hain
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID zaroor chahiye'],
    },

    // Blood Pressure
    bp: {
        systolic: Number,  // Upar wala number 130
        diastolic: Number, // Neeche wala number 80
    },

    // Sugar level
    sugar: {
        type: Number,
    },

    // Weight
    weight: {
        type: Number,
    },

    // Extra notes
    notes: {
        type: String,
        default: '',
    },

    // Kab measure kiya
    measuredAt: {
        type: Date,
        required: [true, 'Date zaroor chahiye'],
    },

},
{
    timestamps: true,
});

export default mongoose.model('Vitals', vitalsSchema);