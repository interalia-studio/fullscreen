import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Session from "./pages/Session";

const App = () => (
  <main>
    <Router>
      <Routes>
        <Route path="/session/:sessionId" element={<Session />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  </main>
);

export default App;
