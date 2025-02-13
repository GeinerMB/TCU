import React from 'react';
import { QuizProvider } from './Contexts/QuizContext'; // Importa el proveedor del contexto
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Para enrutamiento
import logo from './images/wind.png';
import './App.css';
import LoginForm from './components/Auth/LoginForm'; // Página de inicio
import QuizEditor from './components/Teacher/QuizEditor'; // Panel del profesor
import QuizResults from './components/Teacher/QuizResults'; // Panel del profesor
import QuizView from './components/Student/QuizView'; // Vista del estudiante

function App() {
  return (
    <QuizProvider>
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>Nairi Awari lab</p>
          </header>

          {/* Rutas de la aplicación */}
          <Routes>
            <Route path="/" element={<LoginForm />} /> {/* Página de inicio */}
            <Route path="/teacher" element={<QuizEditor />} /> {/* Panel del profesor */}
            <Route path="/quiz/:quizCode" element={<QuizView />} /> {/* Vista del estudiante */}
            <Route path="/results/:quizCode" element={<QuizResults />} />
          </Routes>
        </div>
      </Router>
    </QuizProvider>
  );
}

export default App;