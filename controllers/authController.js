import User from '../models/userModel.js';

const authController = {
  /**
  * Registers a new user with the provided details from the request body.
  * If the email already exists, it returns an error response. Otherwise,
  * it creates a new user, generates an authentication token, saves the user,
  * and returns the user data (excluding the password) and token in the response.
  * 
  * @param {Object} req - The HTTP request object, containing the user's details in the body.
  * @param {Object} res - The HTTP response object used for sending back responses.
  */
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

  /**
  * Authenticates a user based on email and password. If authentication is successful,
  * generates an authentication token, removes the password from the user object, and
  * returns the token and user data. If authentication fails or an error occurs, returns
  * an appropriate error response.
  * 
  * @param {Object} req - The HTTP request object containing the user's email and password.
  * @param {Object} res - The HTTP response object for sending back the response.
  */
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
