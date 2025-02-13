import React, { useState, useContext } from 'react';
import { QuizContext } from '../../Contexts/QuizContext';
import { useNavigate } from 'react-router-dom'; // Para redireccionar
import AudioPlayer from '../Common/AudioPlayer';
import QuestionEditor from './QuestionEditor';

const QuizEditor = () => {
    const { quizzes, setQuizzes, user } = useContext(QuizContext);
    const [currentQuiz, setCurrentQuiz] = useState({
        title: '',
        audio: null,
        questions: []
    });
    const navigate = useNavigate(); // Hook para redireccionar

    const handleAudioUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCurrentQuiz(prev => ({
                ...prev,
                audio: file
            }));
        }
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            id: Date.now(), // ID único basado en timestamp
            type: 'MC', // Tipo por defecto (selección múltiple)
            text: '',
            options: ['Opción 1', 'Opción 2'],
            correctAnswer: ''
        };
        setCurrentQuiz(prev => ({
            ...prev,
            questions: [...prev.questions, newQuestion]
        }));
    };

    const handleQuestionChange = (updatedQuestion) => {
        setCurrentQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(q =>
                q.id === updatedQuestion.id ? updatedQuestion : q
            )
        }));
    };

    const handleDeleteQuestion = (questionId) => {
        setCurrentQuiz(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q.id !== questionId)
        }));
    };

    const handleSaveQuiz = () => {
        const quizCode = `QUIZ-${Date.now()}`; // Genera un código único
        const newQuiz = {
            ...currentQuiz,
            code: quizCode,
            createdBy: user.name
        };

        setQuizzes(prev => ({
            ...prev,
            [quizCode]: newQuiz
        }));

        alert(`Quiz guardado con éxito. Código para estudiantes: ${quizCode}`);
    };

    return (
        <div className="quiz-editor-container">
            <h1>Editor de Quiz</h1>

            {/* Título del Quiz */}
            <input
                type="text"
                value={currentQuiz.title}
                onChange={(e) => setCurrentQuiz(prev => ({
                    ...prev,
                    title: e.target.value
                }))}
                placeholder="Título del quiz"
                className="quiz-title-input"
            />

            {/* Cargar Audio */}
            <div className="audio-upload-section">
                <h3>Audio del Quiz</h3>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                />
                {currentQuiz.audio && (
                    <AudioPlayer audioURL={URL.createObjectURL(currentQuiz.audio)} />
                )}
            </div>

            {/* Preguntas */}
            <div className="questions-section">
                <h3>Preguntas</h3>
                {currentQuiz.questions.map((question) => (
                    <QuestionEditor
                        key={question.id}
                        questionData={question}
                        onQuestionChange={handleQuestionChange}
                        onDelete={() => handleDeleteQuestion(question.id)}
                    />
                ))}
                <button onClick={handleAddQuestion} className="add-question-button">
                    + Añadir Pregunta
                </button>
            </div>

            {/* Guardar Quiz */}
            <button
                onClick={handleSaveQuiz}
                className="save-quiz-button"
                disabled={!currentQuiz.title || currentQuiz.questions.length === 0}
            >
                💾 Guardar Quiz
            </button>

            {/* Lista de quizzes creados */}
            <div className="quizzes-list">
                <h3>Quizzes creados:</h3>
                {Object.entries(quizzes).map(([quizCode, quiz]) => (
                    <div key={quizCode} className="quiz-item">
                        <strong>{quiz.title}</strong> (Código: {quizCode})
                        <button
                            onClick={() => navigate(`/results/${quizCode}`)} // Redirige a la vista de resultados
                            className="view-results-button"
                        >
                            Ver resultados
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizEditor;