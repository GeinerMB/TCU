import React, { useState } from 'react';
import './App.css';
import CreateQuiz from './components/CreateQuiz'; // Importa el componente CreateQuiz
import JoinQuiz from './components/JoinQuiz';     // Importa el componente JoinQuiz

function App() {
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showJoinQuiz, setShowJoinQuiz] = useState(false);

  const handleCreateQuiz = () => {
    setShowCreateQuiz(true);
    setShowJoinQuiz(false);
  };

  const handleJoinQuiz = () => {
    setShowJoinQuiz(true);
    setShowCreateQuiz(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido a Nairi Awari Lab</h1>
        <div className="options">
          <button onClick={handleCreateQuiz}>Crear Quiz</button>
          <button onClick={handleJoinQuiz}>Unirse a Quiz</button>
        </div>

        {showCreateQuiz && <CreateQuiz />}
        {showJoinQuiz && <JoinQuiz />}
      </header>
    </div>
  );
}

export default App;