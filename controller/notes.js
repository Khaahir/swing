import express from "express";
import Note from "../model/noteSchema.js";
import dotenv from "dotenv";
import authUserMiddleware from "../authMiddleware.js";

dotenv.config();

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: API för att hantera notes
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: visar alla notes
 *     description: Fetches all notes from the database for the logged-in user.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   text:
 *                     type: string
 *       401:
 *         description: Unauthorized, invalid or missing token
 *       500:
 *         description: Internal server error
 */

router.get("/", authUserMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({userId: req.user.id});
    res.status(200).json(notes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching notes", error: err.message });
  }
});

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Skapar en ny note
 *     description: Create a new note with a title and text for the logged-in user.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the note.
 *                 example: "My first note"
 *               text:
 *                 type: string
 *                 description: The content of the note.
 *                 example: "This is the text of the note."
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 text:
 *                   type: string
 *       400:
 *         description: Missing title or text
 *       500:
 *         description: Internal server error
 */

router.post("/", authUserMiddleware,   async (req, res) => {
  try {
    const { title, text } = req.body;

    if (!title || !text) {
      return res.status(400).json({ message: "title and text are required" });
    }

    const newNote = new Note({
      title,
      text,
      userId: req.user.id
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
/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: updaterar en redan existerande note
 *     description: Update the title and text of an existing note by its ID.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the note to update.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the note.
 *                 example: "Updated note title"
 *               text:
 *                 type: string
 *                 description: The new content of the note.
 *                 example: "Updated text content"
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Note updated successfully"
 *       400:
 *         description: Missing title or text, or note not found
 *       500:
 *         description: Internal server error
 */

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
    res.status(201).json({ Message: "note got updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating note", error: error.message });
  }
});
/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Tabort a note
 *     description: Delete a note by its ID.
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the note to delete.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *       404:
 *         description: Note not found
 *       500:
 *         description: Internal server error
 */

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
