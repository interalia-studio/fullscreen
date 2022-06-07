import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Board from "./pages/Board";

const App = () => (
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/board/:boardId" element={<Board />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

export default App;
