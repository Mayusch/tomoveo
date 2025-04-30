import mongoose from 'mongoose';

// Defines the Mongoose schema and model for a "CodeBlock" document in MongoDB.
// Each CodeBlock represents a coding exercise with a title, description, a starter code snippet (templateCode), and a corresponding solution (solutionCode).
const CodeBlockSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    templateCode: {
        type: String,
        required: true
    },
    solutionCode: {
        type: String,
        required: true
    }
});

const CodeBlock = mongoose.model('CodeBlock', CodeBlockSchema);

export default CodeBlock;