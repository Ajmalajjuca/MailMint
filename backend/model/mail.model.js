import mongoose from "mongoose";

const mailSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: Date.now
  },
    senderId: {
    type: String,
    required: true
  },
  recipients: {
    type: Array,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  sentAt: {
    type: String,
    default: () => new Date().toLocaleString()
  },
  tone: {
    type: String,
    required: true
  }
});

export default mongoose.model("Mail", mailSchema);
