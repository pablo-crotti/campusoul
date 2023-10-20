import express from "express";
import User from "../models/user.js";

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

  console.log(req.body);
  
  const newUser = new User(req.body);

  newUser.save()
    .then(savedUser => {

      res.send(savedUser);
    })
    .catch(err => {
      next(err);
    });
});

export default router;