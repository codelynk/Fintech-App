const nodemailer = require("nodemailer");

const sendForgotPasswordEmail = async (email, token) => {
  try {
    // creating the mail transporting function
    const mailTransport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailDetails = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password Notification",
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the button below to reset your password:</p>
        <a style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;" 
           href='https://www.yourcareerex.com/reset-password/${token}'>
           Reset Password
        </a>
        <p>If the button above does not work, click the link below:</p>
        <p><a href='https://www.yourcareerex.com/reset-password/${token}'>
          https://www.yourcareerex.com/reset-password/${token}
        </a></p>
        <p>Your token: <strong>${token}</strong></p>
      `,
    };

    await mailTransport.sendMail(mailDetails);
    console.log("Reset password email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};


const validEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


module.exports = {
    sendForgotPasswordEmail,
    validEmail
}