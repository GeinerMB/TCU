import React, { useState } from 'react';
import axios from 'axios';
import './JoinQuiz.css';

const JoinQuiz = () => {
    const [quizCode, setQuizCode] = useState('');
    const [quizData, setQuizData] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [score, setScore] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isEvaluated, setIsEvaluated] = useState(false);

    const handleJoinQuiz = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.get(`https://tcu-production-de21.up.railway.app/api/quizzes/${quizCode.toUpperCase()}`);
            setQuizData(response.data);
            setSelectedAnswers(new Array(response.data.questions.length).fill(null));
            setScore(null);
            setIsEvaluated(false);
        } catch (error) {
            setError('Quiz no encontrado');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswerSelect = (questionIndex, answer) => {
        if (isEvaluated) return;
        const newAnswers = [...selectedAnswers];
        newAnswers[questionIndex] = answer;
        setSelectedAnswers(newAnswers);
    };

    const calculateScore = () => {
        const correctAnswers = quizData.questions.map(q => q.correctAnswer);
        const correctCount = selectedAnswers.filter((answer, index) =>
            answer === correctAnswers[index]
        ).length;

        const finalScore = Math.round((correctCount / quizData.questions.length) * 100);
        setScore(finalScore);
        setIsEvaluated(true);
    };

    const getAnswerStatus = (questionIndex, answer) => {
        if (!isEvaluated) return '';
        const correctAnswer = quizData.questions[questionIndex].correctAnswer;

        if (answer === correctAnswer) return 'correct';
        if (answer === selectedAnswers[questionIndex]) return 'incorrect';
        return '';
    };

    return (
        <div className="join-quiz-container">
            <h2>Unirse a un Quiz</h2>

            {!quizData ? (
                <form onSubmit={handleJoinQuiz} className="join-form">
                    <div className="input-group">
                        <label htmlFor="quizCode">Código del Quiz:</label>
                        <input
                            type="text"
                            id="quizCode"
                            value={quizCode}
                            onChange={(e) => setQuizCode(e.target.value)}
                            placeholder="Ej: A1B2C3D4"
                            maxLength={8}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="main-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Buscando...' : 'Unirse al Quiz'}
                    </button>

                    {error && <div className="error-message">{error}</div>}
                </form>
            ) : (
                <div className={`quiz-details ${isEvaluated ? 'quiz-evaluated' : ''}`}>
                    <h3>{quizData.quizTitle}</h3>
                    {quizData.audio && (
                        <audio controls>
                            <source
                                src={`data:${quizData.audio.contentType};base64,${quizData.audio.data}`}
                            />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    )}
                    <div className="questions-list">
                        {quizData.questions.map((question, index) => (
                            <div key={index} className="question-card">
                                <p className="question-text">{question.question}</p>

                                {question.type === 'multiple' ? (
                                    <div className="answers-grid">
                                        {question.answers.map((answer, i) => {
                                            const status = getAnswerStatus(index, answer);
                                            return (
                                                <div
                                                    key={i}
                                                    className={`answer-card ${status} ${selectedAnswers[index] === answer ? 'selected' : ''
                                                        }`}
                                                    onClick={!isEvaluated ? () => handleAnswerSelect(index, answer) : undefined}
                                                >
                                                    {answer}
                                                    {status === 'correct' && <span className="status-icon">✓</span>}
                                                    {status === 'incorrect' && <span className="status-icon">✕</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="true-false-buttons">
                                        {['Verdadero', 'Falso'].map((option) => {
                                            const status = getAnswerStatus(index, option);
                                            return (
                                                <button
                                                    key={option}
                                                    className={`tf-button ${status} ${selectedAnswers[index] === option ? 'selected' : ''
                                                        }`}
                                                    onClick={() => handleAnswerSelect(index, option)}
                                                    disabled={isEvaluated}
                                                >
                                                    {option}
                                                    {status === 'correct' && <span className="status-icon">✓</span>}
                                                    {status === 'incorrect' && <span className="status-icon">✕</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="quiz-controls">
                        <button
                            className="main-button"
                            onClick={calculateScore}
                            disabled={selectedAnswers.some(answer => answer === null) || isEvaluated}
                        >
                            {isEvaluated ? 'Evaluación Completa' : 'Calificar'}
                        </button>

                        {score !== null && (
                            <div className="score-display">
                                <h4>Puntuación Final: {score}/100</h4>
                                <div className="score-breakdown">
                                    <p>✅ Correctas: {Math.round(score / 100 * quizData.questions.length)}</p>
                                    <p>❌ Incorrectas: {Math.round(quizData.questions.length - (score / 100 * quizData.questions.length))}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JoinQuiz;