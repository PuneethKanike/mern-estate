import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    avatar: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    otpExpires: { type: Date },
    otpVerified: { type: Boolean, default: false },
    fullyVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    passwordResetCount: { type: Number, default: 0 },
    firstPasswordResetRequest: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
export default User;
