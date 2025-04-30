import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../services/api";
import socket from "../services/socket";
import Editor from "./Editor";
import StudentsCount from "./StudentsCount";

//Component renders the detailed view for a specific CodeBlock (coding exercise) using its ID from the URL.
//Provides real-time collaborative editing functionality powered by Socket.IO.
function CodeBlockPage() {
  const { id } = useParams();
  const [block, setBlock] = useState(null);
  const [code, setCode] = useState("");
  const [role, setRole] = useState(() => {
    return localStorage.getItem(`${socket.id}`) || null;
  });
  const [studentsCount, setStudentsCount] = useState(0);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  //Fetches the selected CodeBlock from the server using its ID (`/codeblocks/:id`) and sets the initial code to the template.
  useEffect(() => {
    axios
      .get(`/codeblocks/${id}`)
      .then((res) => {
        const blockData = res.data.data;
        setBlock(blockData);
        setCode(blockData.templateCode);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });

    //User joins a room via WebSocket and is assigned a role (Mentor or Student), which is stored in localStorage to persist between reloads.
    socket.emit("joinRoom", { roomId: id });

    //Listen for events from the server and update the state accordingly.
    const handleStudentCount = (count) => setStudentsCount(count);
    const handleCodeUpdate = (newCode) => setCode(newCode);
    const handleSolutionSuccess = () => setSuccess(true);
    const handleSetRole = (assignedRole) => {
      setRole(assignedRole);
      localStorage.setItem(`${id}-${socket.id}`, assignedRole);
    };
    const handleRoomClosed = () =>
      Object.keys(localStorage).forEach((key) => {
        if (key.includes(`${id}`)) {
          localStorage.removeItem(key);
        }
        navigate("/");
      });

    //Socket listeners are set up
    socket.on("studentCount", handleStudentCount);
    socket.on("codeUpdate", handleCodeUpdate);
    socket.on("roomClosed", handleRoomClosed);
    socket.on("solutionSuccess", handleSolutionSuccess);
    socket.on("setRole", handleSetRole);

    //All socket listeners are cleaned up, and localStorage is cleared for the session.
    return () => {
      socket.off("studentCount", handleStudentCount);
      socket.off("codeUpdate", handleCodeUpdate);
      socket.off("roomClosed", handleRoomClosed);
      socket.off("solutionSuccess", handleSolutionSuccess);
      socket.off("setRole", handleSetRole);
      localStorage.removeItem(`${socket.id}`);
    };
  }, [id, role, navigate]);

  //Displays a success alert when the solution is correctly implemented.
  useEffect(() => {
    if (success) {
      alert("Solution is correct! 😊");
    }
  }, [success]);

  //Communicates with the server when the code changes or a solution is checked.
  function handleCodeChange(newCode) {
    if (!success) {
      setCode(newCode);
      socket.emit("codeChange", { roomId: id, code: newCode });

      if (block?.solutionCode) {
        socket.emit("checkSolution", {
          roomId: id,
          currentCode: newCode,
          solutionCode: block.solutionCode,
        });
      }
    }
  }

  //Handles the user leaving the room by emitting event and clearing the success state.
  function handleLeaveRoom() {
    socket.emit("leavingRoom");
    setSuccess(false);
    localStorage.removeItem(`${id}-${socket.id}`);
    navigate("/");
  }

  //Renders the page with the selected CodeBlock, real-time collaborative editing (mentor is read-only), and solution checking functionality.
  return (
    <div>
      {block && (
        <>
          <div>
            <button onClick={handleLeaveRoom}>Leave Room</button>
          </div>
          <h1>{block.title}</h1>
          <span>{`${role}`}</span>
          <StudentsCount count={studentsCount} />
          <Editor
            code={code}
            onChange={handleCodeChange}
            readOnly={role === "Mentor"}
          />
        </>
      )}
    </div>
  );
}

export default CodeBlockPage;
