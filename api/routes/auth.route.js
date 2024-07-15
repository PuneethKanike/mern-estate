import express from 'express';
import { google, signOut, signin, signup, verifyOtp, requestPasswordReset, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.post('/verify-otp', verifyOtp);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/signout', signOut);

export default router;
