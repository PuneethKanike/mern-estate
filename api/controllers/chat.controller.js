import Chat from '../models/chat.model.js';

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Chat.find().sort({ createdAt: 1 }).populate('replyTo');
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const addMessage = async (req, res, next) => {
  try {
    const { username, avatar, message, replyTo } = req.body;
    const timestamp = new Date().toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
    const newMessage = new Chat({ username, avatar, message, timestamp, replyTo });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};
