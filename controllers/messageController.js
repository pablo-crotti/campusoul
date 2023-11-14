import Message from '../models/messageModel.js';

const MessageController = {
  async sendMessage(req, res) {
    try {
      const { matchId, content } = req.body;
      const senderId = req.user._id; // L'utilisateur authentifié

      const message = new Message({
        match: matchId,
        sender: senderId,
        content: content
      });

      await message.save();
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getMessages(req, res) {
    try {
      const { matchId } = req.params;

      const messages = await Message.find({ match: matchId }).populate('sender', 'name');
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default MessageController;
