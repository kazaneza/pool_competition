import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    played: Number,
    won: Number,
    lost: Number,
    points: Number
  },
  { _id: false }
);

const MatchSchema = new mongoose.Schema(
  {
    id: Number,
    player1Id: Number,
    player2Id: Number,
    completed: Boolean,
    groupId: String,
    winner: Number // optional if match is not completed
  },
  { _id: false }
);

const GroupSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  players: [PlayerSchema],
  matches: [MatchSchema]
});

export default mongoose.models.Group || mongoose.model('Group', GroupSchema);
