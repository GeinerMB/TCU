import React, { useState, useContext } from "react";
import { QuizContext } from "../../Contexts/QuizContext";

const MultipleChoiceQuestion = ({
    questionData,
    isEditable = false,
    onQuestionChange
}) => {
    const { user } = useContext(QuizContext);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // Maneja cambios para estudiantes
    const handleStudentAnswer = (option) => {
        const updatedSelection = selectedOptions.includes(option)
            ? selectedOptions.filter((item) => item !== option)
            : [...selectedOptions, option];

        setSelectedOptions(updatedSelection);
        if (user?.role === 'student') {
            onQuestionChange(updatedSelection);
        }
    };

    // Maneja cambios para profesores (edición)
    const handleEditQuestion = (e) => {
        onQuestionChange({
            ...questionData,
            text: e.target.value
        });
    };

    const handleEditOption = (index, newValue) => {
        const newOptions = [...questionData.options];
        newOptions[index] = newValue;

        onQuestionChange({
            ...questionData,
            options: newOptions
        });
    };

    return (
        <div style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "50px"
        }}>
            {/* Encabezado de pregunta */}
            {isEditable ? (
                <input
                    type="text"
                    value={questionData.text}
                    onChange={handleEditQuestion}
                    placeholder="Escribe tu pregunta"
                    style={{ width: "100%", marginBottom: "10px" }}
                />
            ) : (
                <h4>{questionData.text}</h4>
            )}

            {/* Opciones */}
            <div>
                {questionData.options.map((option, index) => (
                    <label
                        key={index}
                        style={{
                            display: "block",
                            margin: "5px auto",
                            cursor: "pointer",
                            padding: "3px 8px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            backgroundColor: selectedOptions.includes(option) ? "#1b5e20" : "#3a3a3a",
                            maxWidth: "200px"
                        }}
                    >
                        {isEditable ? (
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleEditOption(index, e.target.value)}
                                style={{ marginRight: "10px", width: "80%" }}
                            />
                        ) : (
                            <>
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleStudentAnswer(option)}
                                    style={{ marginRight: "10px" }}
                                />
                                {option}
                            </>
                        )}
                    </label>
                ))}
            </div>

            {/* Añadir nueva opción (solo para profesores) */}
            {isEditable && (
                <button
                    onClick={() => handleEditOption(questionData.options.length, "Nueva opción")}
                    style={{ marginTop: "10px" }}
                >
                    + Añadir opción
                </button>
            )}
        </div>
    );
};

export default MultipleChoiceQuestion;