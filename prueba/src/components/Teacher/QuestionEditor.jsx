import React, { useState } from 'react';

const QuestionEditor = ({
    questionData,
    onQuestionChange,
    onDelete
}) => {
    const [questionType, setQuestionType] = useState(questionData.type || 'MC');
    const [questionText, setQuestionText] = useState(questionData.text || '');
    const [options, setOptions] = useState(questionData.options || []);
    const [correctAnswer, setCorrectAnswer] = useState(questionData.correctAnswer || '');

    const handleAddOption = () => {
        setOptions([...options, `Opción ${options.length + 1}`]);
    };

    const handleOptionChange = (index, newValue) => {
        const newOptions = [...options];
        newOptions[index] = newValue;
        setOptions(newOptions);
    };

    const handleSave = () => {
        const updatedQuestion = {
            id: questionData.id,
            type: questionType,
            text: questionText,
            options: questionType === 'MC' ? options : ['Verdadero', 'Falso'],
            correctAnswer
        };
        onQuestionChange(updatedQuestion);
    };

    return (
        <div className="question-editor-container">
            <div className="editor-header">
                <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                >
                    <option value="MC">Selección Múltiple</option>
                    <option value="TF">Verdadero/Falso</option>
                </select>
                <button onClick={onDelete} className="delete-button">
                    🗑️ Eliminar
                </button>
            </div>

            <div className="editor-body">
                <input
                    type="text"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Escribe tu pregunta"
                    className="question-input"
                />

                {questionType === 'MC' && (
                    <div className="options-section">
                        <h4>Opciones:</h4>
                        {options.map((option, index) => (
                            <div key={index} className="option-row">
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Opción ${index + 1}`}
                                    className="option-input"
                                />
                                <button
                                    onClick={() => setCorrectAnswer(option)}
                                    className={`select-correct-button ${correctAnswer === option ? 'selected' : ''
                                        }`}
                                >
                                    {correctAnswer === option ? '✔️ Correcta' : 'Marcar como correcta'}
                                </button>
                            </div>
                        ))}
                        <button onClick={handleAddOption} className="add-option-button">
                            + Añadir opción
                        </button>
                    </div>
                )}

                {questionType === 'TF' && (
                    <div className="true-false-section">
                        <h4>Respuesta correcta:</h4>
                        <select
                            value={correctAnswer}
                            onChange={(e) => setCorrectAnswer(e.target.value)}
                            className="correct-answer-select"
                        >
                            <option value="">Seleccionar</option>
                            <option value="true">Verdadero</option>
                            <option value="false">Falso</option>
                        </select>
                    </div>
                )}
            </div>

            <button onClick={handleSave} className="save-button">
                💾 Guardar pregunta
            </button>
        </div>
    );
};

export default QuestionEditor;