import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema({

    // Yeh insight kis user ki hai
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID zaroor chahiye'],
    },

    // Yeh insight kis file ki hai
    fileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: [true, 'File ID zaroor chahiye'],
    },

    // English summary
    summaryEnglish: {
        type: String,
        required: true,
    },

    // Roman Urdu summary
    summaryUrdu: {
        type: String,
        required: true,
    },

    // Abnormal values
    abnormalValues: [{
        name: String,   // WBC, Hemoglobin etc
        value: String,  // Actual value
        status: String, // High / Low
    }],

    // Doctor se poochne wale questions
    doctorQuestions: [String],

    // Food suggestions
    foodSuggestions: {
        avoid: [String],   // Kya na khao
        recommended: [String], // Kya khao
    },

    // Home remedies
    homeRemedies: [String],

},
{
    timestamps: true,
});

export default mongoose.model('AiInsight', aiInsightSchema);