const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendSms = async (phone, message) => {
    try {
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });

        return response;
    } catch (error) {
        console.error("Twilio Error:", error);
        throw error;
    }
};

module.exports = {
    sendSms,
};