import Vitals from '../models/Vitals.js';

// ============================================
// Add Vitals – Naye Vitals Add Karo
// ============================================
const addVitals = async (req, res) => {
    try {

        const { bp, sugar, weight, notes, measuredAt } = req.body;

        // Kam az kam ek field zaroor ho
        if (!bp && !sugar && !weight) {
            return res.status(400).json({
                success: false,
                message: 'BP, Sugar ya Weight mein se kuch to dalo! ❌',
            });
        }

        if (!measuredAt) {
            return res.status(400).json({
                success: false,
                message: 'Date zaroor dalo! ❌',
            });
        }

        const vitals = await Vitals.create({
            userId: req.user.id,
            bp,
            sugar,
            weight,
            notes,
            measuredAt,
        });

        res.status(201).json({
            success: true,
            message: 'Vitals add ho gaye! ✅',
            vitals,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================
// Get All Vitals – Sare Vitals Lo
// ============================================
const getAllVitals = async (req, res) => {
    try {

        const vitals = await Vitals.find({ userId: req.user.id })
                                   .sort({ measuredAt: -1 });

        res.status(200).json({
            success: true,
            count: vitals.length,
            vitals,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================
// Update Vitals – Vitals Update Karo
// ============================================
const updateVitals = async (req, res) => {
    try {

        // Step 1 – Vitals find karo
        const vitals = await Vitals.findById(req.params.id);

        // Step 2 – Mili ya nahi
        if (!vitals) {
            return res.status(404).json({
                success: false,
                message: 'Vitals nahi mili! ❌',
            });
        }

        // Step 3 – Yeh vitals is user ki hain?
        if (vitals.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Yeh tumhari vitals nahi hain! ❌',
            });
        }

        // Step 4 – Update karo
        const updated = await Vitals.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Vitals update ho gayi! ✅',
            vitals: updated,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ============================================
// Delete Vitals – Vitals Delete Karo
// ============================================
const deleteVitals = async (req, res) => {
    try {

        // Step 1 – Vitals find karo
        const vitals = await Vitals.findById(req.params.id);

        // Step 2 – Mili ya nahi
        if (!vitals) {
            return res.status(404).json({
                success: false,
                message: 'Vitals nahi mili! ❌',
            });
        }

        // Step 3 – Yeh vitals is user ki hain?
        if (vitals.userId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Yeh tumhari vitals nahi hain! ❌',
            });
        }

        // Step 4 – Delete karo
        await vitals.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Vitals delete ho gayi! ✅',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export { addVitals, getAllVitals, updateVitals, deleteVitals };