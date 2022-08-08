import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "~/pages/Home";
import { Board } from "~/pages/Board";
import { globalStyles } from "~/styles";

const App = () => {
  globalStyles();

  return (
    <Router>
      <Routes>
        <Route path="/board/:boardId" element={<Board />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
