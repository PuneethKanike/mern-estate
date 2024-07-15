import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Generate OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP Email
export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
      user: "livelinkbypuneethk@gmail.com", // Your email
      pass: "ayal gbqr mbdw zfmn", // Your email password
    },
  });

  const mailOptions = {
    from: "livelinkbypuneethk@gmail.com",
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};


export const sendResetPasswordEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: "livelinkbypuneethk@gmail.com",
      pass: "ayal gbqr mbdw zfmn",
    },
  });

  const resetURL = `http://localhost:3000/reset-password?token=${token}`;

  const mailOptions = {
    from: "livelinkbypuneethk@gmail.com",
    to: email,
    subject: 'Password Reset',
    text: `You requested a password reset. Click the link to reset your password: ${resetURL}`,
  };

  await transporter.sendMail(mailOptions);
};
