import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    // Gmail transporter banao
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });

    // Email ka content
    const mailOptions = {
        from: `HealthMate 🏥 <${process.env.GMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    // Email bhejo
    await transporter.sendMail(mailOptions);
};

export default sendEmail;