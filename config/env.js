
import dotenv from 'dotenv';
dotenv.config();

const ENV = {
  production: {
    mongoURI: process.env.MONGODB_URI,
    mongoDBName: process.env.MONGODB_NAME,
    jwtSecret: process.env.JWT_SECRET,
  }
};

export default ENV[process.env.NODE_ENV || 'production'];
