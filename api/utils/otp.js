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

export const sendOTPEmailReset = async (email, otp) => {
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
    text: `Your OTP code for resetting the password is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};



