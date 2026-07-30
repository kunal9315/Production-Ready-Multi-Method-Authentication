const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

const sendEmail = async (to, subject, html)=>{
    console.log("sending email to :",to)

    const info = await transporter.sendMail({
        from: `"Authentication app" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    })

    console.log("email ent:", info.messageId)

}

module.exports = sendEmail