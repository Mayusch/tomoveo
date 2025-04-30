//Sets up real-time socket communication for a collaborative coding platform using Socket.IO.
//Manages a `rooms` object that keeps track of each active room's mentor, students, and shared code content.
export function setupSocket(io) {
  let rooms = {};

  io.on("connection", (socket) => {
    //Upon user connecting they can join a room by emitting 'joinRoom', becoming the mentor (if the room is empty) or student.
    socket.on("joinRoom", ({ roomId }) => {
      let role;

      if (!rooms[roomId]) {
        rooms[roomId] = {
          mentor: socket.id,
          students: [],
          code: "",
        };
        role = "Mentor";
      } else {
        if (socket.id === rooms[roomId].mentor) {
          role = "Mentor";
        } else {
          if (!rooms[roomId].students.includes(socket.id)) {
            rooms[roomId].students.push(socket.id);
            role = "Student";
          } else {
            role = "Student";
          }
        }
      }

      socket.join(roomId);
      socket.roomId = roomId;

      //Users role and student count is broadcasted to all users in the room.
      io.to(socket.id).emit("setRole", role, socket.id);
      io.to(roomId).emit("studentCount", rooms[roomId].students.length);
    });

    //Server updates the room's shared code upon code changing and broadcasts it to other users in the room.
    socket.on("codeChange", ({ roomId, code }) => {
      if (rooms[roomId]) {
        rooms[roomId].code = code;
        socket.to(roomId).emit("codeUpdate", code);
      }
    });

    //Compares the user's submitted code against the correct solution, ignoring whitespace differences, only broadcasting a success status if code matches.
    socket.on("checkSolution", ({ currentCode, solutionCode }) => {
      const normalizeCode = (code) => code.replace(/\s+/g, " ").trim();

      if (normalizeCode(currentCode) === normalizeCode(solutionCode)) {
        io.to(socket.id).emit("solutionSuccess");
      }
    });

    //Handles user disconnection.
    //Mentor leaving: broadcasts a room closure message and removes the room from the `rooms` object.
    //Student leaving: removes them from the room's student list.
    const handleDisconnect = () => {
      for (const roomId in rooms) {
        if (rooms[roomId].mentor === socket.id) {
          io.to(roomId).emit("roomClosed");
          delete rooms[roomId];
        } else {
          rooms[roomId].students = rooms[roomId].students.filter(
            (id) => id !== socket.id
          );
          io.to(roomId).emit("studentCount", rooms[roomId].students.length);
        }
      }
    };

    socket.on("leavingRoom", handleDisconnect);
    socket.on("disconnect", handleDisconnect);
  });
}
