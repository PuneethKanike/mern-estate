import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    avatar: {type: String, required:true},
    message: { type: String, required: true },
    timestamp: { type: String, required: true } // Add this field
  },
  { timestamps: true } // This will still add `createdAt` and `updatedAt` fields
);

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
