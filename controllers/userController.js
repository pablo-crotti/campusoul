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
  }
};

export default userController;
