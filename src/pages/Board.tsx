import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Canvas } from "../components/Canvas";

const Board = () => {
  const { boardId } = useParams();
  let navigate = useNavigate();

  if (boardId == null || boardId.length == 0) navigate("/");

  return (
    <main>
      <Canvas boardId={boardId as string} />
    </main>
  );
};

export default Board;
