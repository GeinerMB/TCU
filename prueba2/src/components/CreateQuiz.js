import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Importamos la función uuidv4 para generar un ID único

const CreateQuiz = () => {
    const [quizTitle, setQuizTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [quizCode, setQuizCode] = useState(''); // Para guardar el código generado

    const handleAddQuestion = () => {
        if (currentQuestion && answers.every(answer => answer !== '') && correctAnswer) {
            const newQuestion = {
                question: currentQuestion,
                answers,
                correctAnswer
            };
            setQuestions([...questions, newQuestion]);
            setCurrentQuestion('');
            setAnswers(['', '', '', '']);
            setCorrectAnswer('');
        }
    };

    const handleSubmit = () => {
        // Generamos el código único para el quiz
        const newQuizCode = uuidv4().slice(0, 8); // Tomamos los primeros 8 caracteres del UUID para un código más corto
        setQuizCode(newQuizCode); // Establecemos el código generado

        // Aquí puedes manejar el envío del quiz o cualquier otra lógica
        console.log('Quiz creado:', { quizTitle, questions, quizCode });
    };

    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    return (
        <div className="create-quiz">
            <h2>Crear un nuevo Quiz</h2>
            <div>
                <label>Título del Quiz:</label>
                <input
                    type="text"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    placeholder="Escribe el título del quiz"
                />
            </div>

            <div>
                <h3>Agregar Pregunta</h3>
                <label>Pregunta:</label>
                <input
                    type="text"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    placeholder="Escribe la pregunta"
                />
            </div>

            <div>
                <h4>Respuestas</h4>
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

            <div>
                <h4>Respuesta Correcta</h4>
                <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                >
                    <option value="">Selecciona la respuesta correcta</option>
                    {answers.map((answer, index) => (
                        <option key={index} value={answer}>
                            {answer}
                        </option>
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
                            <p>{q.question}</p>
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
