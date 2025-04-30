import CodeBlock from "../models/CodeBlock.js";

//Controller defines the logic for handling API requests related to CodeBlocks.
//Exports two functions: `getAllCodeBlocks` and `getCodeBlockById`

//Retrieves all CodeBlock documents from the database and returns them as JSON.
export const getAllCodeBlocks = async (req, res) => {
  try {
    const blocks = await CodeBlock.find();
    res.status(200).json({ success: true, data: blocks });
  } catch (error) {
    console.error("error fetching blocks:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Retrieves a single CodeBlock based on the MongoDB document ID provided in the URL parameter.
export const getCodeBlockById = async (req, res) => {
  try {
    const block = await CodeBlock.findById(req.params.id);
    res.status(200).json({ success: true, data: block });
  } catch (error) {
    console.error("error finding block:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
