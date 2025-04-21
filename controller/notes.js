import express from "express";
import Note from "../model/noteSchema.js";
import dotenv from "dotenv";
import authUserMiddleware from "../authMiddleware.js";

dotenv.config();

const router = express.Router();

router.get("/", authUserMiddleware, async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching notes", error: err.message });
  }
});

router.post("/", authUserMiddleware,   async (req, res) => {
  try {
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).json({ message: "title and text are required" });
    }

    const newNote = new Note({
      title,
      text,
    });

    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating note", error: error.message });
  }
});

router.put("/:id", authUserMiddleware, async (req, res) => {
  try {
    const { title, text } = req.body;
    if (!title || !text) {
      res.status(400).json({ Message: "title and text are requierd" });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, text },
      { new: true, runValidators: true }
    );
    if (!updatedNote) {
      return res.status(400).json({ Message: "note not found" });
    }
    res.status(200).json({ Message: "note got updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating note", error: error.message });
  }
});

router.delete("/:id", authUserMiddleware, async (req, res) => {
  try {
    const deleteNote = await Note.findByIdAndDelete(req.params.id);

    if (!deleteNote) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully", deleteNote });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting note", error: error.message });
  }
});

export default router;
