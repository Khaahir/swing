import mongoose from "mongoose";

const signUpSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, 
    minlength: 3, 
    maxlength: 50, 
  },

  password: {
    type: String,
    required: true,
    minlength: 6, 
    maxlength: 150, 
  },
}, { timestamps: true }); 

export default mongoose.model("User", signUpSchema);
