const { Schema, model } = require('mongoose');

// Schema to create a thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      get: createdAtDate => moment(createdAtDate).format('MMM DD, YYYY [at] hh:mm a')
    },
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'reactions',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

//Initialize our post model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;