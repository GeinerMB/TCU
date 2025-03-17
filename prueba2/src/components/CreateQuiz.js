import React, { useState } from 'react';
import './CreateQuiz.css';
import axios from "axios";

const CreateQuiz = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [questionType, setQuestionType] = useState('multiple');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [quizCode, setQuizCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Maneja cambios en las respuestas
    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    // Cambia entre pregunta múltiple/Verdadero-Falso
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

    // Agrega una nueva pregunta
    const handleAddQuestion = () => {
        let isValid = false;

        if (questionType === 'multiple') {
            isValid = currentQuestion.trim() !== '' &&
                answers.every(answer => answer.trim() !== '') &&
                correctAnswer.trim() !== '';
        } else if (questionType === 'true_false') {
            isValid = currentQuestion.trim() !== '' &&
                correctAnswer.trim() !== '';
        }

        if (isValid) {
            const newQuestion = {
                question: currentQuestion.trim(),
                type: questionType,
                answers: questionType === 'true_false'
                    ? ['Verdadero', 'Falso']
                    : answers.map(a => a.trim()),
                correctAnswer: correctAnswer.trim()
            };

            setQuestions([...questions, newQuestion]);
            setCurrentQuestion('');
            setQuestionType('multiple');
            setAnswers(['', '', '', '']);
            setCorrectAnswer('');
        }
    };

    // Envía el quiz al backend
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const quizData = {
                quizTitle: quizTitle.trim(),
                questions: questions.map(q => ({
                    ...q,
                    answers: q.answers.map(a => a.trim())
                }))
            };

            const response = await axios.post("http://localhost:5000/api/quizzes", quizData);

            setQuizCode(response.data.quizCode);
            alert("¡Quiz guardado con éxito!");
        } catch (error) {
            alert(error.response?.data?.error || "Error al guardar el quiz");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-quiz-container">
            <h2 className="quiz-title">Crear un nuevo Quiz</h2>

            {/* Sección: Título del Quiz */}
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

            {/* Sección: Tipo de Pregunta */}
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

            {/* Sección: Agregar Pregunta */}
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

            {/* Sección: Respuestas */}
            {questionType === 'multiple' ? (
                <div className="section-container">
                    <h4 className="section-title">Respuestas (Máx. 4)</h4>
                    {answers.map((answer, index) => (
                        <div key={index} className="answer-input-container">
                            <input
                                className="form-input"
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

            {/* Selección de Respuesta Correcta */}
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

            {/* Botones de Acción */}
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
                    disabled={isSubmitting || questions.length === 0 || !quizTitle}
                >
                    {isSubmitting ? "Guardando..." : "💾 Guardar Quiz"}
                </button>
            </div>

            {/* Preguntas Agregadas */}
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

            {/* Mensaje de Éxito */}
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