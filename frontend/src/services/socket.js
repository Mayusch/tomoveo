import { io } from "socket.io-client";

const port = process.env.REACT_APP_PORT || 5005;

//Sets up and exports a configured Socket.IO client instance for real-time communication with the backend server.
const socket = io(`${process.env.REACT_APP_SOCKET_URL}`, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;
