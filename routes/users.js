import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import crypto from "crypto";

const router = express.Router();

router.get('/', function(req, res, next) {
  User.find()
    .sort('name')
    .exec()
    .then(users => {
      res.send(users);
    })
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const plainPassword = req.body.password;
  const costFactor = 10;
  const salt = crypto.randomBytes(16).toString('hex');

  const password = plainPassword + salt;

  bcrypt.hash(password, costFactor).then(hasedPassword => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hasedPassword,
      salt: salt,
      birthdate: req.body.birthdate,
      bio: req.body.bio,
      location: {
        type: "Point",
        coordinates: [req.body.longitude, req.body.latitude]
      },
      last_activity: req.body.last_activity,
      created_at: new Date()
    })
    return newUser.save();
  }).then(savedUser => {
    res.send(savedUser);
  }).catch(err => {
    next(err);
  });
});

export default router;