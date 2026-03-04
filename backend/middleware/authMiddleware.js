import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        let token;

        // Token cookie mein check karo
        if (req.cookies.token) {
            token = req.cookies.token;
        }

        // Token mila nahi to error do
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Pehle login karo! 🔐',
            });
        }

        // Token verify karo
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 1 – User find karo DB mein
        const user = await User.findById(decoded.id);

        // Step 2 – User mila ya nahi check karo
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Yeh user exist nahi karta! ❌',
            });
        }

        // Step 3 – User mila to req mein assign karo
        req.user = user;

        next(); // Aage jao

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token valid nahi hai! ❌',
        });
    }
};
export default protect;