import React from "react";
import { useNavigate } from "react-router-dom";

//Component represents a clickable card for an individual coding exercise (CodeBlock).
//Receives a `block` object as a prop containing the title, description, and unique MongoDB `_id` of the exercise.
//When clicked, it redirects to page for the specific code block (`/codeblock/:id`).
function CodeBlockCard({ block }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/codeblock/${block._id}`)}
      style={{
        border: "1px solid #ccc",
        margin: "10px",
        padding: "20px",
        cursor: "pointer",
        borderRadius: "10px",
        width: "200px",
      }}
    >
      <h2>{block.title}</h2>
      <p>{block.description}</p>
    </div>
  );
}

export default CodeBlockCard;
