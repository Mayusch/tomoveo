import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LobbyPage from './components/LobbyPage';
import CodeBlockPage from './components/CodeBlockPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LobbyPage />} />
        <Route path="/codeblock/:id" element={<CodeBlockPage />} />
      </Routes>
    </Router>
  );
}

export default App;
