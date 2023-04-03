const { Schema, model } = require('mongoose');

// Schema to create a reaction model
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: ()=> new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
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
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Reaction = model('reaction', reactionSchema);

module.exports = Reaction;