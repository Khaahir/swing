import mongoose, { model } from "mongoose";

const signUpSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 10,
  },

  password: {
    type: String,
    required: true,
    maxlength: 150,
  },
});

export default mongoose.model("signup", signUpSchema);
