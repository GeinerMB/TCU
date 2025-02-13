import React, { createContext, useState } from 'react';

// Crear el contexto
export const QuizContext = createContext();

// Proveedor del contexto
export const QuizProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Usuario actual (profesor o estudiante)
    const [quizzes, setQuizzes] = useState({}); // Todos los quizzes
    const [studentResults, setStudentResults] = useState({}); // Resultados de los estudiantes

    // Guardar un nuevo quiz
    const saveQuiz = (quizCode, quizData) => {
        setQuizzes(prev => ({
            ...prev,
            [quizCode]: quizData
        }));
    };

    // Guardar resultados de un estudiante
    const saveStudentResult = (quizCode, result) => {
        setStudentResults(prev => ({
            ...prev,
            [quizCode]: {
                ...prev[quizCode],
                [result.studentName]: result
            }
        }));
    };

    // Obtener un quiz por su código
    const getQuizByCode = (quizCode) => {
        return quizzes[quizCode] || null;
    };

    // Obtener resultados de un quiz
    const getQuizResults = (quizCode) => {
        return studentResults[quizCode] || {};
    };

    // Valores proporcionados por el contexto
    const contextValue = {
        user,
        setUser,
        quizzes,
        setQuizzes,
        studentResults,
        setStudentResults,
        saveQuiz,
        saveStudentResult,
        getQuizByCode,
        getQuizResults
    };

    return (
        <QuizContext.Provider value={contextValue}>
            {children}
        </QuizContext.Provider>
    );
};