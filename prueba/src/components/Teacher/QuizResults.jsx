import React, { useContext } from 'react';
import { QuizContext } from '../../Contexts/QuizContext';
import { useParams } from 'react-router-dom';

const QuizResults = () => {
    const { quizCode } = useParams(); // Obtener el código del quiz desde la URL
    const { getQuizResults } = useContext(QuizContext); // Acceder al contexto
    const results = getQuizResults(quizCode); // Obtener los resultados del quiz

    if (!results) {
        return <div>No se encontraron resultados para este quiz.</div>;
    }

    return (
        <div className="quiz-results-container">
            <h2>Resultados del Quiz: {quizCode}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Estudiante</th>
                        <th>Respuestas</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(results).map(([studentName, result]) => (
                        <tr key={studentName}>
                            <td>{studentName}</td>
                            <td>
                                <ul>
                                    {Object.entries(result.answers).map(([questionId, answer]) => (
                                        <li key={questionId}>
                                            <strong>Pregunta {questionId}:</strong> {JSON.stringify(answer)}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default QuizResults;