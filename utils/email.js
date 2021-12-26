const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, otp) => {
  // create reusable transporter object using the default SMTP transport
  console.log("Sending email...", email, subject, otp);
  console.log(process.env.BASE_URL);
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: `<h3>OTP for account verification is </h3> 
      <h1 style='font-weight:bold;margin-left:1px'>${otp}</h1>`,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;