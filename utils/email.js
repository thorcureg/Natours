const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        //Activate in gmail "less secure app" option
    });
    // 2)
    const mailOptions = {
        from: 'Hector Cureg <hello@test.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        //html
    };
    // 3)
    await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
