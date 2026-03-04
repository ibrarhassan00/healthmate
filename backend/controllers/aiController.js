import { GoogleGenerativeAI } from '@google/generative-ai';
import AiInsight from '../models/AiInsight.js';
import File from '../models/File.js';

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });


// Gemini ko yeh instructions denge
const buildPrompt = () => {
    return `
    You are a medical report analyzer.
    Analyze the uploaded medical report and respond ONLY in this exact JSON format:

    {
        "summaryEnglish": "Simple english summary of the report",
        "summaryUrdu": "Simple roman urdu summary of the report",
        "abnormalValues": [
            {
                "name": "WBC",
                "value": "11.5",
                "status": "High"
            }
        ],
        "doctorQuestions": [
            "Question 1 to ask doctor",
            "Question 2 to ask doctor"
        ],
        "foodSuggestions": {
            "avoid": ["Food 1", "Food 2"],
            "recommended": ["Food 1", "Food 2"]
        },
        "homeRemedies": ["Remedy 1", "Remedy 2"]
    }

    Important:
    - Respond ONLY with JSON, no extra text
    - summaryUrdu must be in Roman Urdu
    - Keep summaries simple and easy to understand
    - Always add disclaimer in summaryEnglish: "Please consult your doctor"
    `;
};

// ============================================
// Analyze File – Gemini Se Analysis Lo
// ============================================
const analyzeFile = async (req, res) => {
    try {

        // Step 1 – File find karo
        const file = await File.findById(req.params.fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File nahi mili! ❌',
            });
        }

        // Step 2 – Yeh file is user ki hai?
        if (file.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Yeh tumhari file nahi hai! ❌',
            });
        }

        // Step 3 – Pehle se analysis hai?
        const existingInsight = await AiInsight.findOne({
            fileId: file._id,
        });

        if (existingInsight) {
            return res.status(200).json({
                success: true,
                message: 'Pehle se analysis mojood hai! ✅',
                insight: existingInsight,
            });
        }

        // Step 4 – Cloudinary se file fetch karo
        const response = await fetch(file.cloudinary.url);
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');

        // Step 5 – Gemini ko bhejo // Dynamic mimeType logic
   
let mimeType;

if (file.fileType === 'pdf') {
    mimeType = 'application/pdf';
} else if (['png', 'jpg', 'jpeg', 'webp'].includes(file.fileType.toLowerCase())) {
    // Agar image hai to sahi extension lagao, warna default image/jpeg
    mimeType = `image/${file.fileType.toLowerCase() === 'png' ? 'png' : 'jpeg'}`;
} else {
    // Agar extension nahi mil rahi to image/png ya jpeg default rakhein
    mimeType = 'image/jpeg'; 
}

const result = await model.generateContent([
    {
        inlineData: {
            mimeType: mimeType,
            data: base64,
        },
    },
    buildPrompt(),
]);

        // Step 6 ko is tarah safe banayein:
const text = result.response.text();
const jsonMatch = text.match(/\{[\s\S]*\}/); // Yeh sirf JSON object nikalega

if (!jsonMatch) {
    throw new Error("AI ne sahi JSON format mein response nahi diya.");
}

const clean = jsonMatch[0];
const parsed = JSON.parse(clean);

        // Step 7 – DB mein save karo
        const insight = await AiInsight.create({
            userId: req.user.id,
            fileId: file._id,
            summaryEnglish: parsed.summaryEnglish,
            summaryUrdu: parsed.summaryUrdu,
            abnormalValues: parsed.abnormalValues,
            doctorQuestions: parsed.doctorQuestions,
            foodSuggestions: parsed.foodSuggestions,
            homeRemedies: parsed.homeRemedies,
        });

        res.status(201).json({
            success: true,
            message: 'Analysis complete ho gayi! ✅',
            insight,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { analyzeFile };