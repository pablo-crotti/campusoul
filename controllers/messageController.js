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
  async getMessages(req, res) {
    try {
      const { matchId } = req.params;
      const userId = req.user._id;
      const userIdString = userId.toString();

      console.log('Match ID:', matchId);
      console.log('User ID:', userIdString);

      // Fetch the messages for the matchId.
      const messages = await Message.find({ match: matchId }).populate('sender', 'name').lean();
      console.log('Messages before update:', messages);

      // Update the 'read' status for messages where the current user is the receiver.
      const updateResult = await Message.updateMany(
        { match: matchId, receiver: userIdString, read: false },
        { $set: { read: true } }
      );

      // Log the result of the update operation for debugging.
      console.log('Update result:', updateResult);

      // Send the messages as a response (they won't reflect the update as they were fetched before the update).
      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching or updating messages:', error);
      res.status(500).json({ message: error.message });
    }
  },

  async getLastMessage(req, res) {
    try {
      const { matchId } = req.params;

      const message = await Message.find({ match: matchId }).sort({ createdAt: -1 }).limit(1);
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async readMessages(req, res) {
    try {
      const { matchId } = req.params;

      const messages = await Message.updateMany({ match: matchId, receiver: req.user._id }, { $set: { readed: true } });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default MessageController;
