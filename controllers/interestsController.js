import Interest from '../models/interestModel.js';

const interestController = {
  /**
  * Creates a new interest entry in the database. Extracts the interest name from the request body,
  * creates a new Interest object, saves it to the database, and returns the created interest.
  * In case of errors, responds with an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object containing the interest's name in the body.
  * @param {Object} res - The HTTP response object for sending back the created interest or an error message.
  */
  async createInterest(req, res) {
    try {
      const { name } = req.body;
      const interest = new Interest({ name });
      await interest.save();
      res.status(201).json(interest);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  /**
  * Deletes an interest entry from the database based on the provided ID.
  * If the interest with the specified ID is found, it is deleted and a success response is returned.
  * If the interest is not found, returns a 404 not found response. In case of other errors,
  * responds with an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object containing the interest's ID in the params.
  * @param {Object} res - The HTTP response object for sending back the deletion status or an error message.
  */
  async deleteInterest(req, res) {
    try {
      const { id } = req.params;
      const interest = await Interest.findByIdAndDelete(id);
      if (!interest) {
        return res.status(404).json({ message: 'Interest not found' });
      }
      res.status(200).json({ message: 'Interest deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
  * Retrieves all interest entries from the database and returns them.
  * In case of an error during retrieval, responds with an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object (not used in this method but required for route handling).
  * @param {Object} res - The HTTP response object for sending back the list of interests or an error message.
  */
  async getAllInterests(req, res) {
    try {
      const interests = await Interest.find();
      res.status(200).json({ interests });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
  * Retrieves a specific interest entry from the database using the provided ID.
  * If the interest is found, it is returned; if not, a 404 not found response is sent.
  * In case of other errors, responds with an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object containing the interest's ID in the params.
  * @param {Object} res - The HTTP response object for sending back the interest data or an error message.
  */
  async getInterest(req, res) {
    try {
      const interest = await Interest.findById(req.params.id);
      if (!interest) {
        return res.status(404).json({ message: 'Interest not found' });
      }
      res.status(200).json({ interest });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
  * Updates an existing interest entry in the database with the provided data.
  * The interest to be updated is identified by the ID in the request parameters.
  * If the update is successful, returns the updated interest data.
  * In case of errors, responds with an appropriate error message.
  * 
  * @param {Object} req - The HTTP request object containing the interest's ID in the params and update data in the body.
  * @param {Object} res - The HTTP response object for sending back the updated interest data or an error message.
  */
  async updateInterest(req, res) {
    try {
      const interest = await Interest.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json({ interest });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default interestController;