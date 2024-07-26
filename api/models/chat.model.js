import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    avatar: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: String, required: true },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      default: null
    }
  },
  { timestamps: true } // This will still add `createdAt` and `updatedAt` fields
);

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;
