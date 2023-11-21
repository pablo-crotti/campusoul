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
      const userId = req.user._id; 
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
      const userId = req.user._id; 
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
  },
  async setUserLocation(req, res) {
    try {
      const userId = req.user._id;
      const { type, coordinates } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.location = {
        type,
        coordinates
      };
      await user.save();
      res.json(user.location);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async getAllUsers(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const users = await User.find().skip(skip).limit(limit);
        const total = await User.countDocuments();

        res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

};

export default userController;
