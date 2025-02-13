import React from 'react';
import { useParams } from 'react-router-dom';

const QuizPage = ({ quizData }) => {
    const { quizCode } = useParams();  // Obtenemos el código del quiz desde la URL

    if (!quizData || quizData.quizCode !== quizCode) {
        return <p>Quiz no encontrado.</p>;
    }

    const { questions } = quizData;

    return (
        <div>
            <h2>Quiz: {quizCode}</h2>
            {questions.length === 0 ? (
                <p>No hay preguntas en este quiz.</p>
            ) : (
                <div>
                    <h3>Responde las siguientes preguntas:</h3>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <p>{question.question}</p>
                            <ul>
                                {question.answers.map((answer, i) => (
                                    <li key={i}>
                                        <label>
                                            <input type="radio" name={`question${index}`} value={answer} />
                                            {answer}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuizPage;
