import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { generateOTP, sendOTPEmail } from '../utils/otp.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.fullyVerified) {
        return next(errorHandler(409, 'Email is already taken!'));
      } else {
        // Update existing user's OTP and other fields if they are not fully verified
        existingUser.username = username;
        existingUser.password = hashedPassword;
        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        await existingUser.save();
        await sendOTPEmail(email, otp);
        return res.status(201).json({ message: 'OTP sent to your email!' });
      }
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await newUser.save();
    await sendOTPEmail(email, otp);
    res.status(201).json({ message: 'OTP sent to your email!' });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return next(errorHandler(400, 'Invalid or expired OTP!'));
    }

    // OTP is valid, complete the signup process
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpVerified = true; // Mark the OTP as verified
    user.fullyVerified = true; // Mark the user as fully verified
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully! You can now sign in.' });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    if (!validUser.otpVerified || !validUser.fullyVerified) {
      return next(errorHandler(401, 'Please complete the verification process first!'));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};


export const signOut = (req, res) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
}



