import express from "express";
import {
  getAllCodeBlocks,
  getCodeBlockById,
} from "../controllers/codeBlockController.js";

//Express router handles HTTP requests related to CodeBlock resources.
//Defines two routes for retrieving code blocks and delegate the logic to controller functions (`getAllCodeBlocks` and `getCodeBlockById`)

const router = express.Router();

// GET /api/codeblocks - Retrieves all code blocks from the database.
router.get("/", getAllCodeBlocks);

// GET /api/codeblocks/:id - Retrieves a single code block based on the provided ID.
router.get("/:id", getCodeBlockById);

export default router;
