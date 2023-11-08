import User from '../models/userModel.js';

const userController = {
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async addInterestToUser(req, res) {
    try {
      const userId = req.user._id; // Supposons que req.user est le user authentifié
      // const { interestId } = req.body;
      const { interestId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.addInterest(interestId);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async removeInterestFromUser(req, res) {
    try {
      const userId = req.user._id; // Supposons que req.user est le user authentifié
      const interestId = req.params.interestId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.removeInterest(interestId);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async getUserInterests(req, res) {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate('interests');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user.interests);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default userController;
