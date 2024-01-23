import User from '../models/userModel.js';
import Like from '../models/likeModel.js';
import Match from '../models/matchModel.js';

const userController = {
  /**
  * Retrieves the profile of a user specified by the user ID in the request parameters.
  * If the user is found, their profile is returned; if not, a 404 not found response is sent.
  * In case of other errors, responds with an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object containing the user's ID in the params.
  * @param {Object} res - The HTTP response object for sending back the user's profile or an error message.
  */
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

  /**
  * Updates the profile of a user specified by the user ID in the request parameters.
  * The updated profile data is taken from the request body. Returns the updated user profile.
  * In case of errors, responds with an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object containing the user's ID in the params and the updated profile data in the body.
  * @param {Object} res - The HTTP response object for sending back the updated user profile or an error message.
  */
  async updateProfile(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
  * Adds an interest to a user's profile. The user is identified by their ID from the request user object,
  * and the interest is specified by its ID in the request body. Updates the user's profile with the new interest.
  * If the user is not found, returns a 404 not found response. In case of other errors, responds with an error message.
  * 
  * @param {Object} req - The HTTP request object containing the user's ID in the user object and the interest ID in the body.
  * @param {Object} res - The HTTP response object for sending back the updated user profile or an error message.
  */
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

  /**
  * Removes an interest from a user's profile. The user is identified by their ID from the request user object,
  * and the interest to be removed is specified by its ID in the request parameters. Updates the user's profile
  * by removing the specified interest. If the user is not found, returns a 404 not found response. In case of
  * other errors, responds with an error message.
  * 
  * @param {Object} req - The HTTP request object containing the user's ID in the user object and the interest ID in the params.
  * @param {Object} res - The HTTP response object for sending back the updated user profile or an error message.
  */
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

  /**
  * Retrieves the interests of a specific user. The user is identified by their ID in the request parameters.
  * If the user is found, their interests are returned; if not, a 404 not found response is sent.
  * In case of other errors, responds with an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object containing the user's ID in the params.
  * @param {Object} res - The HTTP response object for sending back the user's interests or an error message.
  */
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

  /**
  * Updates the location of a specific user. The user is identified by their ID in the request parameters.
  * The location type and coordinates are provided in the request body. If the user is found, their location
  * is updated and returned; if not, a 404 not found response is sent. In case of other errors, responds with
  * an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object containing the user's ID in the params and location data in the body.
  * @param {Object} res - The HTTP response object for sending back the updated location data or an error message.
  */
  async setUserLocation(req, res) {
    try {
      const userId = req.params.userId;
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

  /**
  * Retrieves a paginated list of users based on combined filters including age range and maximum distance.
  * Excludes the logged-in user from the list. The filters and pagination parameters are provided in the request query.
  * If no users are found, returns a 404 not found response. In case of other errors, responds with an error message.
  * 
  * @param {Object} req - The HTTP request object containing filter parameters (minAge, maxAge, maxDistance) in the query, and the logged-in user's details in the user object.
  * @param {Object} res - The HTTP response object for sending back the paginated list of users or an error message.
  */
  async getAllUsers(req, res) {
    try {
      const likes = await Like.find({ fromUser: req.user._id });
      const likedUserIds = likes.map(like => like.toUser);
      const matches = await Match.find({ users: req.user._id, isMatchActive: true });
      const matchedUserIds = matches.map(match => match.users.filter(user => user.toString() !== req.user._id.toString())[0]);
      const excludedUserIds = [...likedUserIds, ...matchedUserIds];
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const skip = (page - 1) * limit;

      const loggedInUserId = req.user._id;
      const currentLocation = req.user.location.coordinates;

      let users;

      const minAge = parseInt(req.query.minAge);
      const maxAge = parseInt(req.query.maxAge);

      const maxDistance = parseInt(req.query.maxDistance);

      users = await User.findByCombinedFilters(minAge, maxAge, currentLocation, maxDistance);

      users = users.filter(user => user._id.toString() !== loggedInUserId.toString());
      excludedUserIds.forEach(userId => {
        users = users.filter(user => user._id.toString() !== userId.toString());
      });

      const total = users.length;

      if (!users.length) return res.status(404).json({ message: 'No users found' });

      res.status(200).json({
        total,
        page,
        totalPages: Math.ceil(total / limit),
        users,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
  * Deletes a user's profile based on the provided user ID in the request parameters.
  * If the deletion is successful, returns a confirmation message. In case of errors,
  * responds with an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object containing the user's ID in the params.
  * @param {Object} res - The HTTP response object for sending back the deletion confirmation or an error message.
  */
  async deleteProfile(req, res) {
    try {
      const userId = req.params.userId;
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default userController;