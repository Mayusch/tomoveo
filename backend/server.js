import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import codeBlockRoutes from "./routes/codeBlockRoutes.js";
import { setupSocket } from "./sockets/socketHandler.js";

import { connectMongoDB } from "./config/connectMongoDB.js";
import { seedDatabase } from "./config/seed.js";

//Loads environment variables using `dotenv`.
dotenv.config();

const app = express();
const sPORT = process.env.sPORT || 5005;
const fPORT = process.env.fPORT || 3000;
process.env.REACT_APP_API_URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: `${process.env.REACT_APP_API_URL}`,
  credentials: true,
};

//Configures Middlewares
app.use(cors(corsOptions)); //CORS settings for cross-origin access from the frontend.
app.use(express.json()); //to parse request bodies as JSON
app.use(express.urlencoded({ extended: true })); //to parse form data as URL-encoded

//Create HTTP server
const server = http.createServer(app);

//Create Socket.IO server and configures it with CORS settings.
const io = new Server(server, {
  cors: {
    origin: `${process.env.REACT_APP_SOCKET_URL}`,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//Defines API routes for CodeBlock-related operations.
app.use("/api/codeblocks", codeBlockRoutes);

//Sets up Socket.IO server for real-time collaborative coding, using `setupSocket` to handle room logic and live code syncing.
setupSocket(io);

//Serves static frontend files when in production mode (e.g., from a React build).
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
  });
}

//Starts the HTTP server on a specified port, connects to the MongoDB database, and seeds it with default code block exercises on startup.
server.listen(sPORT, async () => {
  await connectMongoDB();
  await seedDatabase();
  console.log(`Server running on ${process.env.REACT_APP_API_URL}`,);
});
