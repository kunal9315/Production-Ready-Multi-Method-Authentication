const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
});


const sendEmail = async (to, subject, html) => {
    try {
        console.log("Sending email to:", to);

        const info = await transporter.sendMail({
            from: `"Authentication App" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Email sent successfully");
        console.log(info);
    } catch (err) {
        console.error("Email Error:");
        console.error(err);
        throw err;
    }
};

module.exports = sendEmail;