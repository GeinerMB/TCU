import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './CreateQuiz.css';

const CreateQuiz = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [questionType, setQuestionType] = useState('multiple');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [quizCode, setQuizCode] = useState('');

    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    const handleQuestionTypeChange = (type) => {
        setQuestionType(type);
        if (type === 'true_false') {
            setAnswers(['Verdadero', 'Falso']);
            setCorrectAnswer('');
        } else {
            setAnswers(['', '', '', '']);
            setCorrectAnswer('');
        }
    };

    const handleAddQuestion = () => {
        let isValid = false;

        if (questionType === 'multiple') {
            isValid = currentQuestion &&
                answers.every(answer => answer !== '') &&
                correctAnswer;
        } else if (questionType === 'true_false') {
            isValid = currentQuestion && correctAnswer;
        }

        if (isValid) {
            const newQuestion = {
                question: currentQuestion,
                type: questionType,
                answers: questionType === 'true_false' ? ['Verdadero', 'Falso'] : answers,
                correctAnswer
            };
            setQuestions([...questions, newQuestion]);
            setCurrentQuestion('');
            setQuestionType('multiple');
            setAnswers(['', '', '', '']);
            setCorrectAnswer('');
        }
    };

    const handleSubmit = () => {
        const newQuizCode = uuidv4().slice(0, 8);
        setQuizCode(newQuizCode);
        console.log('Quiz creado:', {
            quizTitle,
            questions,
            quizCode: newQuizCode
        });
    };

    return (
        <div className="create-quiz-container">
            <h2 className="quiz-title">Crear un nuevo Quiz</h2>

            <div className="input-group">
                <label className="form-label">Título del Quiz: </label>
                <input
                    className="form-input"
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Escribe el título del quiz"
                />
            </div>

            <div className="section-container">
                <h3 className="section-title">Tipo de Pregunta</h3>
                <div className="button-group">
                    <button
                        className={`type-button ${questionType === 'multiple' ? 'active' : ''}`}
                        onClick={() => handleQuestionTypeChange('multiple')}
                    >
                        📝 Opción Múltiple
                    </button>
                    <button
                        className={`type-button ${questionType === 'true_false' ? 'active' : ''}`}
                        onClick={() => handleQuestionTypeChange('true_false')}
                    >
                        ✔️ Verdadero/Falso
                    </button>
                </div>
            </div>

            <div className="section-container">
                <h3 className="section-title">Agregar Pregunta</h3>
                <div className="input-group">
                    <label className="form-label">Pregunta: </label>
                    <input
                        className="form-input"
                        type="text"
                        value={currentQuestion}
                        onChange={(e) => setCurrentQuestion(e.target.value)}
                        placeholder="Escribe la pregunta"
                    />
                </div>
            </div>

            {questionType === 'multiple' ? (
                <div className="section-container">
                    <h4 className="section-title">Respuestas (Máx. 4)</h4>
                    {answers.map((answer, index) => (
                        <div key={index} className="answer-input-container">
                            <input
                                className="answer-input"
                                type="text"
                                value={answer}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                placeholder={`Respuesta ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="section-container">
                    <h4 className="section-title">Opciones</h4>
                    <div className="true-false-container">
                        <div className="true-false-option">✅ Verdadero</div>
                        <div className="true-false-option">❌ Falso</div>
                    </div>
                </div>
            )}

            <div className="section-container">
                <h4 className="section-title">Respuesta Correcta</h4>
                <select
                    className="answer-select"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    disabled={questionType === 'true_false' && !answers.every(a => a !== '')}
                >
                    <option value="">Selecciona la respuesta correcta</option>
                    {answers.map((answer, index) => (
                        answer && (
                            <option key={index} value={answer}>
                                {answer}
                            </option>
                        )
                    ))}
                </select>
            </div>

            <div className="action-buttons">
                <button
                    className="main-button add"
                    onClick={handleAddQuestion}
                    disabled={!currentQuestion}
                >
                    📥 Agregar Pregunta
                </button>
                <button
                    className="main-button save"
                    onClick={handleSubmit}
                    disabled={questions.length === 0 || !quizTitle}
                >
                    💾 Guardar Quiz
                </button>
            </div>

            <div className="added-questions">
                <h3 className="section-title">Preguntas Agregadas</h3>
                <ul className="question-list">
                    {questions.map((q, index) => (
                        <li key={index} className="question-item">
                            <p className="question-text">
                                {q.question}
                                <span className="question-type">
                                    ({q.type === 'multiple' ? 'Opción Múltiple' : 'Verdadero/Falso'})
                                </span>
                            </p>
                            <ul className="answer-list">
                                {q.answers.map((answer, i) => (
                                    <li
                                        key={i}
                                        className={`answer-item ${answer === q.correctAnswer ? 'correct' : ''}`}
                                    >
                                        {answer} {answer === q.correctAnswer && "✅"}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            {quizCode && (
                <div className="success-box">
                    <h3 className="success-title">¡Quiz creado con éxito! 🎉</h3>
                    <p className="code-text">
                        Código del Quiz: <strong className="highlight">{quizCode}</strong>
                    </p>
                    <p className="instruction-text">
                        Comparte este código para que otras personas se unan a tu quiz.
                    </p>
                </div>
            )}
        </div>
    );
};

export default CreateQuiz;