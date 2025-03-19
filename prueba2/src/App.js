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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido a Nairi Awari Lab</h1>
        <div className="options">
          <button onClick={handleCreateQuiz}>Crear Quiz</button>
          <button onClick={handleJoinQuiz}>Unirse a Quiz</button>
          <button onClick={handleDeleteQuiz}>Eliminar Quiz</button>
        </div>

        {showCreateQuiz && <CreateQuiz />}
        {showJoinQuiz && <JoinQuiz />}
        {showDeleteQuiz && <DeleteQuiz />}
      </header>
    </div>
  );
}

export default App;