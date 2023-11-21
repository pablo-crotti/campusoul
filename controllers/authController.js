import User from '../models/userModel.js';

const authController = {
  async register(req, res) {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user = new User(req.body);
      const token = await user.generateAuthToken(); 
      await user.save();

      user.password = undefined; 

      res.status(201).json({ user, token }); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({ email: req.body.email }).select('+password');
      if (!user || !(await user.comparePassword(req.body.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = await user.generateAuthToken(); 

      user.password = undefined; 

      res.status(200).json({ token, user }); 
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default authController;
