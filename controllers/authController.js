import User from '../models/userModel.js';

const authController = {
  async register(req, res) {
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user = new User(req.body);
      const token = await user.generateAuthToken(); // Générer un token pour l'utilisateur
      await user.save();

      user.password = undefined; // Ne pas inclure le mot de passe dans la réponse

      res.status(201).json({ user, token }); // Inclure le token dans la réponse
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

      const token = await user.generateAuthToken(); // Générer un nouveau token

      user.password = undefined; // Ne pas inclure le mot de passe dans la réponse

      res.status(200).json({ token, user }); // Inclure le token dans la réponse
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default authController;
