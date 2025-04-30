import React from "react";

//Presentational component that displays the number of students currently connected in a coding room.
function StudentsCount({ count }) {
  return <p>Students Online: {count}</p>;
}

export default StudentsCount;
