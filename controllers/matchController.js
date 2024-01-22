import Match from '../models/matchModel.js';
import Like from '../models/likeModel.js';

const MatchController = {
  /**
  * Handles the 'like' action from one user to another. If both users have liked each other,
  * a match is created and both likes are removed from the database. If only one user has liked,
  * the like is saved in the database. In case of errors, responds with an error message.
  * 
  * @param {Object} req - The HTTP request object containing the user's ID (fromUser) in the user object and the target user's ID (toUserId) in the body.
  * @param {Object} res - The HTTP response object for sending back the created like or match, or an error message.
  */
  async likeUser(req, res) {
    try {
      const fromUserId = req.user._id;
      const { toUserId } = req.body;

      const existingLike = await Like.findOne({
        fromUser: toUserId,
        toUser: fromUserId,
      });

      if (existingLike) {
        const match = new Match({
          users: [fromUserId, toUserId],
        });

        await match.save();

        await Like.deleteMany({
          $or: [
            { fromUser: fromUserId, toUser: toUserId },
            { fromUser: toUserId, toUser: fromUserId },
          ],
        });
        return match;
      } else {
        const like = new Like({
          fromUser: fromUserId,
          toUser: toUserId,
        });

        await like.save();
        return like;
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  /**
  * Retrieves a list of active matches for the logged-in user. Each match includes user details,
  * excluding passwords. In case of errors, responds with an error message.
  * 
  * @param {Object} req - The HTTP request object containing the logged-in user's ID in the user object.
  * @param {Object} res - The HTTP response object for sending back the list of matches or an error message.
  */
  async listMatches(req, res) {
    try {
      const userId = req.user._id;
      const matches = await Match.find({
        users: userId,
        isMatchActive: true,
      }).populate('users', '-password');

      res.status(200).json(matches);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },
  
  /**
  * Dissolves an existing match between users. The match is identified by the matchId in the request parameters.
  * Only a user involved in the match can dissolve it. Sets the match's 'isMatchActive' status to false.
  * In case of errors or unauthorized access, responds with an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object containing the match's ID in the params and the user's ID in the user object.
  * @param {Object} res - The HTTP response object for sending back the status of the dissolved match or an error message.
  */
  async unmatchUser(req, res) {
    try {
      const { matchId } = req.params;
      const userId = req.user._id;

      const match = await Match.findById(matchId);
      if (!match) {
        return res.status(404).json({ message: 'Match non trouvé' });
      }

      if (!match.users.includes(userId)) {
        return res.status(401).json({ message: 'Action non autorisée' });
      }

      match.isMatchActive = false;
      await match.save();

      res.status(200).json({ message: 'Match dissous avec succès', match });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async getMatch(req, res) {
    try {
      const { matchId } = req.params;
      const userId = req.user._id;

      console.log(matchId, userId);

      const match = await Match.findById(matchId).populate('users', '-password');
      if (!match) {
        return res.status(404).json({ message: 'Match non trouvé' });
      }

      res.status(200).json(match);
    }
    catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

export default MatchController;