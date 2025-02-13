import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizContext } from '../../Contexts/QuizContext';
import AudioPlayer from '../Common/AudioPlayer';
import MultipleChoiceQuestion from '../Common/MSQuestion';
import TrueFalseQuestion from '../Common/TFQuestion';

const QuizView = () => {
    const { quizCode } = useParams();
    const { user, quizzes } = useContext(QuizContext);
    const navigate = useNavigate();

    const [currentQuiz, setCurrentQuiz] = useState(null);
    const [studentAnswers, setStudentAnswers] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Cargar quiz cuando el componente se monta
    useEffect(() => {
        const quiz = quizzes[quizCode];
        if (quiz) {
            setCurrentQuiz(quiz);
            // Inicializar respuestas vacías
            const initialAnswers = quiz.questions.reduce((acc, q) => {
                acc[q.id] = q.type === 'MC' ? [] : '';
                return acc;
            }, {});
            setStudentAnswers(initialAnswers);
        } else {
            navigate('/'); // Redirigir si el quiz no existe
        }
    }, [quizCode, quizzes]);

    const handleAnswerChange = (questionId, answer) => {
        setStudentAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleSubmit = () => {
        // Guardar resultados en el contexto
        const results = {
            studentName: user.name,
            answers: studentAnswers,
            timestamp: new Date().toISOString()
        };

        // Actualizar contexto (en un backend real, aquí harías un fetch)
        console.log('Resultados:', results);
        setHasSubmitted(true);
        setTimeout(() => navigate('/'), 3000); // Redirigir después de 3 segundos
    };

    if (!currentQuiz) return <div>Cargando quiz...</div>;

    return (
        <div className="quiz-view-container">
            <h2>Quiz: {currentQuiz.title || `Código ${quizCode}`}</h2>
            <p>Estudiante: {user?.name}</p>

            <div className="audio-section">
                <AudioPlayer audioURL={currentQuiz.audio} />
            </div>

            <div className="questions-section">
                {currentQuiz.questions.map((question) => (
                    <div key={question.id} className="question-wrapper">
                        {question.type === 'MC' ? (
                            <MultipleChoiceQuestion
                                questionData={question}
                                onQuestionChange={(answer) =>
                                    handleAnswerChange(question.id, answer)
                                }
                            />
                        ) : (
                            <TrueFalseQuestion
                                questionData={question}
                                onQuestionChange={(answer) =>
                                    handleAnswerChange(question.id, answer)
                                }
                            />
                        )}
                    </div>
                ))}
            </div>

            {!hasSubmitted ? (
                <button
                    onClick={handleSubmit}
                    className="submit-button"
                    disabled={Object.values(studentAnswers).some(a =>
                        Array.isArray(a) ? a.length === 0 : a === ''
                    )}
                >
                    Enviar Respuestas
                </button>
            ) : (
                <div className="success-message">
                    ✔️ Respuestas enviadas correctamente. Redirigiendo...
                </div>
            )}
        </div>
    );
};

export default QuizView;