import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
      maxlength: 50,
    },
    text: {
      required: true,
      type: String,
      maclength: 300,
    },
  },
  { timestamps: true }
);

export default mongoose.model("note", NoteSchema);
