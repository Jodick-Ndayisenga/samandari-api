const User = require("../models/user.model");
const appPassoword = "jjfvjkvptmunfnsy";
const appEmail = "samandari.spaceedafrica@gmail.com";
const nodemailer = require("nodemailer");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: appEmail,
    pass: appPassoword,
  },
});

function generateOtpCode() {
  return Math.floor(Math.random() * 90000) + 10000;
}
const generateConfirmationToken = () => {
  const crypto = require("crypto");
  return crypto.randomBytes(20).toString("hex");
};

const sendConfirmationEmail = async (userEmail, id, code) => {
  const confirmationToken = code;
  const confirmationLink = `https://samandari.spaceedafrica.org/email-confirmed/${confirmationToken}/${id}`;

  const mailOptions = {
    from: appEmail,
    to: userEmail,
    subject: "Welcome to Samandari! Confirm Your Email",
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Samandari App - Confirm Your Email</title>
        </head>
        <body>
        <div style="font-family: Arial, sans-serif; width: 100%; margin: 0 auto; padding: 20px; color:black;">
            <h1 style="color: #007bff;">Thank You for Signing Up to Samandari!</h1>
            <p>Welcome to Samandari, the ultimate social platform. We're excited to have you on board!</p>
            <p>To get started, please confirm your email address by clicking the button below:</p>
            <div style="text-align: center; margin-top: 20px;">
            <a href="${confirmationLink}" style="width:fit-content; display: block; padding: 5px 15px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Confirm Email</a>
            </div>
            <p>If you didn't sign up for Samandari or received this email by mistake, you can safely ignore it.</p>
            <p>Thank you,</p>
            <h3>The Samandari Team</h3>
        </div>
        </body>
        </html>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent:", info.response);
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

// EMAIL TO RESET THE PASSWORD
const resetPasswordEmail = async (userMail,firstName,  OTP) => {
  const mailOptions = {
    from: appEmail,
    to: userMail,
    subject: "Your OTP for Password Change",
    html: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div class="container">
          <div>
            <p>Dear ${firstName},</p>
    
            <p style="width:50%">
              We have received your request to change your password. To ensure the
              security of your account, therefore take this verification process seriously.
              To proceed, please use the following OTP code:
            </p>
            <h3 style="font-size: 20px">OTP: <span style="font-size: 30px;font-style: italic;letter-spacing: 3px;">${OTP}</span></h3>
            <p>
              Please enter this code on the password change page to confirm your
              identity and continue with the process.
            </p>
            <p>Disclaimer: <i>If you did not initiate this request, please ignore this email.</i> </p>
            <p>Best Regards</p>
            <h2>Samandari Team</h2>
          </div>
        </div>
      </body>
    </html>
    
        `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

// END OF EMAIL



exports.registerUser = async (req, res) => {
  try {
    const user = req.body;
    user.token = generateConfirmationToken();
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = await User.create(user);
    await sendConfirmationEmail(newUser.email, newUser._id, newUser.token);
    res.status(200).json({ message: "success", user: newUser });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = {};
      for (let field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      res.status(400).json({ errors });
    } else if (err.keyValue.email) {
      res.status(400).json({ message: "email" });
    } else if (err.keyValue.username) {
      res.status(400).json({ message: "username" });
    } else if (err.keyValue.phoneNumber) {
      res.status(400).json({ message: "phone" });
    } else {
      res.status(500).json({ message: err.message });
    }
  }
};

exports.confirmEmail = async (req, res) => {
  const { id, token } = req.body;
  try {
    const user = await User.findById(id);
    if (user) {
      if (user.token !== token) {
        res.status(400).json({ feedback: "evil" });
      } else if (user.verified) {
        res.status(400).json({ feedback: "already" });
      } else {
        user.verified = true;
        await user.save();
        res.status(200).json({ feedback: "success" });
      }
    }
  } catch (err) {
    res.status(400).json({ feedback: "nouser" });
  }
};

exports.getEmailForPasswordForgotten = async (req, res) => {
  const email = req.params.email;
  try{
    const user = await User.findOne({ email: email });
    if(user){
      const serverOtp = generateOtpCode()
      await resetPasswordEmail(email, user.firstName, serverOtp);
      res.status(200).json({success: true, otp:serverOtp});
    }
  }catch (err) {
    res.status(400).json({ feedback:err})
  }
};

exports.changePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try{
    const user = await User.findOne({ email: email });
    if(user){
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.status(200).json({success: true});
    }
  }catch (err) {
    res.status(400).json({ feedback:err})
  }
};
