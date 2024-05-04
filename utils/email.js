const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  //Create Transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //Define mail options
  const mailOptions = {
    from: "Tejas Khera <hello@mail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
