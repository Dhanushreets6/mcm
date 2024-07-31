import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  date: {
    type: Date,
    require: true,
  },
  caseNumber: String,
  partyName: String,
  status: String,
});

const Case = mongoose.model("cases", caseSchema);

export { Case };
