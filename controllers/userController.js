const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        res.json(users)
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user by Id
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user 
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Thought.deleteMany(
            {
              _id: { $in: user.thoughts },
            }
          )
      )
      .then(() =>
        res.json({ message: 'User successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  //Update a user 
  updateUser(req, res) {
    User.findOneAndUpdate(
      { id: req.body.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
  .then((user) =>
    !user
      ? res.status(404).json({ message: 'No user with this id!' })
      : res.json(user)
  )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    }
    )
},

  // Add an friend to friend list
  addFriend(req, res) {
  console.log('You are adding a friend');
  console.log(req.body);
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendId } },
    { runValidators: true, new: true }
  )
    .then((friend) =>
      !friend
        ? res
          .status(404)
          .json({ message: 'No friend found with that ID :(' })
        : res.json(friend)
    )
    .catch((err) => res.status(500).json(err));
},
// Remove friend from friend list
removeFriend(req, res) {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { runValidators: true, new: true }
  )
    .then((user) =>
      !user
        ? res
          .status(404)
          .json({ message: 'No user found with that ID :(' })
        : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
},
};
