import React, { useState } from 'react';
import './App.css';
import CreateQuiz from './components/CreateQuiz';
import JoinQuiz from './components/JoinQuiz';
import DeleteQuiz from './components/DeleteQuiz';

function App() {
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showJoinQuiz, setShowJoinQuiz] = useState(false);
  const [showDeleteQuiz, setShowDeleteQuiz] = useState(false);

  const handleCreateQuiz = () => {
    setShowCreateQuiz(true);
    setShowJoinQuiz(false);
    setShowDeleteQuiz(false);
  };

  const handleJoinQuiz = () => {
    setShowJoinQuiz(true);
    setShowCreateQuiz(false);
    setShowDeleteQuiz(false);
  };

  const handleDeleteQuiz = () => {
    setShowDeleteQuiz(true);
    setShowCreateQuiz(false);
    setShowJoinQuiz(false);
  };

  const showCredits = () => {
    alert("Geiner Montoya Barrientos\nUniversidad de Costa Rica\nProyecto: TCU-501\nFecha: " + new Date().toLocaleDateString());
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo.jpeg" alt="Logo" className="logo" />
        <h1>Bienvenido a Nairi Awari Lab</h1>
        <div className="options">
          <button onClick={handleCreateQuiz}>Crear Quiz</button>
          <button onClick={handleJoinQuiz}>Unirse a Quiz</button>
          <button onClick={handleDeleteQuiz}>Eliminar Quiz</button>
        </div>
        <div className="info-buttons">
          <button className="info-button" onClick={() => window.open("TU_LINK_A_INSTRUCCIONES", "_blank")}>Instrucciones</button>
          <button className="info-button" onClick={showCredits}>Créditos</button>
        </div>
        {showCreateQuiz && <CreateQuiz />}
        {showJoinQuiz && <JoinQuiz />}
        {showDeleteQuiz && <DeleteQuiz />}
      </header>

    </div>
  );
}

export default App;