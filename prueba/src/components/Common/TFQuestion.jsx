import React, { useState, useContext } from "react";
import { QuizContext } from "../../Contexts/QuizContext";

const TrueFalseQuestion = ({
    questionData,
    isEditable = false,
    onQuestionChange
}) => {
    const { user } = useContext(QuizContext);
    const [selectedOption, setSelectedOption] = useState(null);

    // Manejar respuesta del estudiante
    const handleStudentAnswer = (option) => {
        setSelectedOption(option);
        if (user?.role === 'student') {
            onQuestionChange(option);
        }
    };

    // Manejar edición del profesor
    const handleEditQuestion = (e) => {
        onQuestionChange({
            ...questionData,
            text: e.target.value
        });
    };

    return (
        <div style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "5px"
        }}>
            {/* Encabezado editable para profesores */}
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

            {/* Opciones True/False */}
            <div>
                <label style={{ marginRight: "15px" }}>
                    <input
                        type="radio"
                        value="true"
                        checked={!isEditable && selectedOption === "true"}
                        onChange={() => handleStudentAnswer("true")}
                        disabled={isEditable}
                    />
                    Verdadero
                </label>
                <label>
                    <input
                        type="radio"
                        value="false"
                        checked={!isEditable && selectedOption === "false"}
                        onChange={() => handleStudentAnswer("false")}
                        disabled={isEditable}
                    />
                    Falso
                </label>
            </div>

            {/* Sección de respuesta correcta para profesores */}
            {isEditable && (
                <div style={{ marginTop: "10px" }}>
                    <label>
                        Respuesta correcta:
                        <select
                            value={questionData.correctAnswer || ""}
                            onChange={(e) => onQuestionChange({
                                ...questionData,
                                correctAnswer: e.target.value
                            })}
                        >
                            <option value="">Seleccionar</option>
                            <option value="true">Verdadero</option>
                            <option value="false">Falso</option>
                        </select>
                    </label>
                </div>
            )}
        </div>
    );
};

export default TrueFalseQuestion;