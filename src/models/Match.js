import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema(
  {
    players: { type: [String], required: true },
    scores: { type: Object, required: true },
    winner: { type: String, required: true },
  },
  { timestamps: true }
);

const Match = mongoose.models.Match || mongoose.model("Match", MatchSchema);
export default Match;
