import Message from '../models/messageModel.js';
import Match from '../models/matchModel.js';
import mongoose from 'mongoose';

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
      const userId = req.user._id;
      const userIdObjectId = new mongoose.Types.ObjectId(userId.toString());  // Ensure it's an ObjectId
  
      console.log('Match ID:', matchId);
      console.log('User ID:', userId);
  
      // Fetch the messages for the matchId where the user is the receiver.
      const messages = await Message.find({ match: matchId, sender: { $ne: userIdObjectId } }).populate('sender', 'name').lean();
      console.log('Messages before update:', messages);
  
      // Update the 'read' status for messages where the current user is the receiver (sender is not the current user).
      const updateResult = await Message.updateMany(
        { match: matchId, sender: { $ne: userIdObjectId }, read: false },  // Update where sender is not the user
        { $set: { read: true } }
      );
  
      // Log the result of the update operation for debugging.
      console.log('Update result:', updateResult);
      const final = await Message.find({ match: matchId }).populate('sender', 'name');
  
      // Send the updated final as a response.
      res.status(200).json(final);
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

  async getTotalUnreadMessages(req, res) {
    try {
      const { matchId } = req.params;
      const totalUnreadMessages = await Message.countDocuments({ match: matchId, read: false });
      res.status(200).json(totalUnreadMessages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};



export default MessageController;
