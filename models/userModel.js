import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String
  },
  name: {
    type: String,
    trim: true,
  },
  birthdate: {
    type: Date
  },
  bio: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      validate: {
        validator: validateGeoJsonCoordinates,
        message: '{VALUE} is not a valid longitude/latitude(/altitude) coordinates array'
      }
    }
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  interests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interest'
  }],
  images: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

/**
* Customizes the JSON representation of the user document. This method is automatically
* called when JSON.stringify() is used on a user document. It modifies the user object
* to exclude sensitive information like password and token before converting it to JSON.
* 
* @returns {Object} - The user object without the password and token fields.
*/
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.token;
  return user;
};

/**
* Pre-save hook for the User schema. Hashes the user's password before saving,
* if the password field has been modified.
*/
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

/**
* Compares a candidate password with the user's stored password.
* 
* @param {string} candidatePassword - The password to be compared.
* @returns {Promise<boolean>} - A promise that resolves to a boolean indicating if the passwords match.
*/
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
* Generates an authentication token for the user.
* 
* @returns {Promise<string>} - A promise that resolves to the generated JWT token.
*/
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
  user.token = token;
  await user.save();
  return token;
};

/**
* Adds an interest to the user's profile. Throws an error if the interest is already added
* or if the maximum number of interests (5) has been reached.
* 
* @param {string} interestId - The ID of the interest to add.
* @throws {Error} - If the interest is already added or the maximum number of interests is exceeded.
*/
userSchema.methods.addInterest = async function (interestId) {
  if (this.interests.includes(interestId)) {
    throw new Error('Interest already added.');
  }
  if (this.interests.length >= 5) {
    throw new Error('You can only add up to 5 interests.');
  }
  this.interests.push(interestId);
  await this.save();
};

/**
* Removes an interest from the user's profile.
* 
* @param {string} interestId - The ID of the interest to remove.
*/
userSchema.methods.removeInterest = async function (interestId) {
  this.interests = this.interests.filter(id => id.toString() !== interestId.toString());
  await this.save();
};

userSchema.index({ location: '2dsphere' });

/**
* Validates if a given value is a valid set of GeoJSON coordinates.
* 
* @param {Array} value - An array of coordinate values.
* @returns {boolean} - True if the value is a valid set of GeoJSON coordinates, false otherwise.
*/
function validateGeoJsonCoordinates(value) {
  return Array.isArray(value) && value.length >= 2 && value.length <= 3 && isLongitude(value[0]) && isLatitude(value[1]);
}

/**
* Checks if a given value is a valid latitude.
* 
* @param {number} value - The value to check.
* @returns {boolean} - True if the value is a valid latitude, false otherwise.
*/
function isLatitude(value) {
  return value >= -90 && value <= 90;
}

/**
* Checks if a given value is a valid longitude.
* 
* @param {number} value - The value to check.
* @returns {boolean} - True if the value is a valid longitude, false otherwise.
*/
function isLongitude(value) {
  return value >= -180 && value <= 180;
}

/**
* Static method for the User schema. Finds users by combined filters including age range and location proximity.
* The age range is calculated based on birthdate and the location filter uses GeoJSON coordinates and a maximum distance.
* 
* @param {number} minAge - The minimum age for the age filter.
* @param {number} maxAge - The maximum age for the age filter.
* @param {Array} currentLocation - The current location as GeoJSON coordinates.
* @param {number} maxDistance - The maximum distance in kilometers for the location filter.
* @returns {Promise<Array>} - A promise that resolves to an array of users matching the filters.
*/
userSchema.statics.findByCombinedFilters = async function (minAge, maxAge, currentLocation, maxDistance) {
  const currentDate = new Date();

  const baseFilters = {};

  if (minAge && maxAge) {
    const minBirthdate = new Date(currentDate.getFullYear() - maxAge - 1, currentDate.getMonth(), currentDate.getDate());
    const maxBirthdate = new Date(currentDate.getFullYear() - minAge, currentDate.getMonth(), currentDate.getDate());
    baseFilters.birthdate = { $gte: minBirthdate, $lte: maxBirthdate };
  }

  if (currentLocation && maxDistance) {
    baseFilters.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: currentLocation,
        },
        $maxDistance: maxDistance * 1000,
      },
    };
  }

  const result = await this.find(baseFilters).select('name birthdate location bio interests images');

  return result;
};

const User = mongoose.model('User', userSchema);

export default User;