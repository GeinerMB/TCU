import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
        <div className="create-quiz">
            <h2>Crear un nuevo Quiz</h2>

            <div>
                <label>Título del Quiz: </label>
                <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Escribe el título del quiz"
                />
            </div>

            <div>
                <h3>Tipo de Pregunta</h3>
                <div>
                    <button
                        onClick={() => handleQuestionTypeChange('multiple')}
                        style={{
                            backgroundColor: questionType === 'multiple' ? '#4CAF50' : '#e7e7e7',
                            marginRight: '10px'
                        }}
                    >
                        Opción Múltiple
                    </button>
                    <button
                        onClick={() => handleQuestionTypeChange('true_false')}
                        style={{
                            backgroundColor: questionType === 'true_false' ? '#4CAF50' : '#e7e7e7'
                        }}
                    >
                        Verdadero/Falso
                    </button>
                </div>
            </div>

            <div>
                <h3>Agregar Pregunta</h3>
                <label>Pregunta: </label>
                <input
                    type="text"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    placeholder="Escribe la pregunta"
                />
            </div>

            {questionType === 'multiple' ? (
                <div>
                    <h4>Respuestas (Máx. 4)</h4>
                    {answers.map((answer, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                placeholder={`Respuesta ${index + 1}`}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <h4>Opciones</h4>
                    <p>Verdadero</p>
                    <p>Falso</p>
                </div>
            )}

            <div>
                <h4>Respuesta Correcta</h4>
                <select
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

            <button onClick={handleAddQuestion}>Agregar Pregunta</button>
            <button onClick={handleSubmit}>Guardar Quiz</button>

            <div>
                <h3>Preguntas Agregadas</h3>
                <ul>
                    {questions.map((q, index) => (
                        <li key={index}>
                            <p>{q.question} <small>({q.type === 'multiple' ? 'Opción Múltiple' : 'Verdadero/Falso'})</small></p>
                            <ul>
                                {q.answers.map((answer, i) => (
                                    <li key={i}>
                                        {answer} {answer === q.correctAnswer && "(Correcta)"}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>

            {quizCode && (
                <div>
                    <h3>¡Quiz creado con éxito!</h3>
                    <p>Código del Quiz: <strong>{quizCode}</strong></p>
                    <p>Comparte este código para que otras personas se unan a tu quiz.</p>
                </div>
            )}
        </div>
    );
};

export default CreateQuiz;