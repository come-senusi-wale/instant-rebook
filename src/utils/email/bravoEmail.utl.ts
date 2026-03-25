import * as nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {

        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
            user: process.env.BREVO_LOGIN, 
            pass: process.env.BREVO_SMTP_KEY,
            },
        });

        await transporter.sendMail({
            from: `"Yawa App Technologies Ltd" <communicationsyawa@gmail.com>`,
            to,
            subject,
            html,
        });
        
    } catch (error) {
        console.error("Bravo Email Error:", error);
        throw new Error("Failed to send email");
    }
  
};