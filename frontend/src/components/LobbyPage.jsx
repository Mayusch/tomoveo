import React, { useEffect, useState } from "react";
import axios from "../services/api";
import CodeBlockCard from "./CodeBlockCard";

//Component serves as main lobby or entry point where users can browse available CodeBlocks.
function LobbyPage() {
  const [blocks, setBlocks] = useState([]);

  //Makes an HTTP GET request to the `/codeblocks` endpoint to fetch all code block data from the backend.
  //Response data is stored in the `blocks` state array.
  useEffect(() => {
    axios
      .get("/codeblocks")
      .then((res) => {
        console.log("API response:", res.data);
        setBlocks(res.data.data);
      })
      .catch((err) => {
        console.error("API error:", err);
      });
  }, []);

  //Renders and displays a list of 'CodeBlockCard' components, each representing a different coding exercise.
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Choose Code Block</h1>
      <div
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
      >
        {blocks.map((block) => (
          <CodeBlockCard key={block._id} block={block} />
        ))}
      </div>
    </div>
  );
}

export default LobbyPage;
