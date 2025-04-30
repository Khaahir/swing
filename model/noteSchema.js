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
      maxlength: 300,
    },
    userId:{
      type:mongoose.Schema.Types.ObjectId, ref: "User", required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("note", NoteSchema);
