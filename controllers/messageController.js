import Message from '../models/messageModel.js';
import Match from '../models/matchModel.js';

const MessageController = {
  async sendMessage(req, res) {
    try {
      const { matchId, content } = req.body;
      const senderId = req.user._id; // L'utilisateur authentifié
      const match = await Match.findById(matchId);
      let receiverId;
      if (!match) {
        return res.status(404).json({ message: 'Match not found' });
      }
      if (match.users[0] == senderId) {
        receiverId = match.users[1]
      } else {
        receiverId = match.users[0]
      }
      const message = new Message({
        match: matchId,
        sender: senderId,
        receiver: receiverId,
        content: content
      });

      await message.save();
      // res.status(201).json(message);
      return message;
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
