const { Thought, User, reactionSchema } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a thought
  deleteThought(req, res) {
    console.log('delete id =', req.params.thoughtId)
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) => {
        console.log('delete succeded, thought =', thought)
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : 
            User.findOneAndUpdate(
              {thoughts: req.params.thoughtId},
              {$pull: {thoughts: req.params.thoughtId}},
              {new: true}
      )
        })
      .then(() => res.json({ message: 'Thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a reaction
  createReaction(req, res) {
    console.log('thoughts id = ', req.params.thoughtId)
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId }, 
      { $addToSet: {reactions: req.body}},
      { runValidators: true, new: true,}
      )
      .then((thought) => { 
        console.log('thought =', thought)
        res.json(thought)})
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: {reactions: {reactionId: req.params.reactionId}}},
      { runValidators: true, new: true,}
      )
      .then((thought) =>{
      if (  !thought) {
          res.status(404).json({ message: 'No reaction with that ID' })
  }})
      .then(() => res.json( thought ))
      .catch((err) => res.status(500).json(err));
  },
};