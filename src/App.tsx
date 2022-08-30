import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Home } from "~/pages/Home";
import { Board } from "~/pages/Board";
import { globalStyles } from "~/styles";

const App = () => {
  globalStyles();

  return (
    <Router>
      <Routes>
        <Route path="/board" element={<Board />} />
        <Route path="/board/:boardId" element={<Board />} />
        <Route index element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
