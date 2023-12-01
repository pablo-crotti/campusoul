import Message from '../models/messageModel.js';
import Match from '../models/matchModel.js';

const MessageController = {
  /**
  * Sends a message within an existing match. The match and message content are provided in the request body.
  * Identifies the sender based on the logged-in user and determines the receiver within the match.
  * If the match is not found or other errors occur, responds with an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object containing the match ID and message content in the body, and the sender's user ID in the user object.
  * @param {Object} res - The HTTP response object for sending back the sent message or an error message.
  */
  async sendMessage(req, res) {
    try {
      const { matchId, content } = req.body;
      const senderId = req.user._id;
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
      return message;
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
  * Retrieves all messages within a specific match. The match ID is provided in the request params.
  * If the match is not found or other errors occur, responds with an appropriate error message.
  *  
  * @param {Object} req - The HTTP request object containing the match ID in the params.
  * @param {Object} res - The HTTP response object for sending back the list of messages or an error message.
  */
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
