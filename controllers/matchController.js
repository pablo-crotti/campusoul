import Match from '../models/matchModel.js';
import Like from '../models/likeModel.js';
import User from '../models/userModel.js';

const MatchController = {
  // Liker un utilisateur
  async likeUser(req, res) {
    try {
      const fromUserId = req.user._id; // L'ID de l'utilisateur authentifié
      const { toUserId } = req.body; // L'ID de l'utilisateur à liker

      // Vérifier si 'toUser' a déjà aimé 'fromUser'
      const existingLike = await Like.findOne({
        fromUser: toUserId,
        toUser: fromUserId,
      });

      if (existingLike) {
        // Si le like mutuel existe, créer un match
        const match = new Match({
          users: [fromUserId, toUserId],
        });

        await match.save();

        // Supprimer les "likes" puisqu'ils sont maintenant un match
        await Like.deleteMany({
          $or: [
            { fromUser: fromUserId, toUser: toUserId },
            { fromUser: toUserId, toUser: fromUserId },
          ],
        });

        res.status(201).json({ message: 'Match créé avec succès!', match });
      } else {
        // Si le like mutuel n'existe pas, créer un like
        const like = new Like({
          fromUser: fromUserId,
          toUser: toUserId,
        });

        await like.save();
        res.status(201).json({ message: 'Like créé avec succès!', like });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Lister les matchs d'un utilisateur
  async listMatches(req, res) {
    try {
      const userId = req.user._id; // L'ID de l'utilisateur authentifié
      const matches = await Match.find({
        users: userId,
        isMatchActive: true,
      }).populate('users', '-password');

      res.status(200).json(matches);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  // Dissoudre un match
  async unmatchUser(req, res) {
    try {
      const { matchId } = req.params;
      const userId = req.user._id;

      const match = await Match.findById(matchId);
      if (!match) {
        return res.status(404).json({ message: 'Match non trouvé' });
      }

      // Vérifier si l'utilisateur fait partie du match
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
};

export default MatchController;
