import React, { useState } from 'react';
import axios from 'axios';
import './DeleteQuiz.css'; // Asegúrate de crear este archivo CSS

const DeleteQuiz = () => {
    const [quizCode, setQuizCode] = useState('');
    const [adminCode, setAdminCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await axios.delete(
                `https://tcu-production-de21.up.railway.app/api/quizzes/${quizCode.toUpperCase()}`,
                { data: { adminCode } }
            );

            setMessage(response.data.message);
            setQuizCode('');
            setAdminCode('');
        } catch (error) {
            setError(error.response?.data?.error || "Error al eliminar el quiz");
        }
    };

    return (
        <div className="delete-quiz-container">
            <h2>Eliminar Quiz Existente</h2>

            <form onSubmit={handleSubmit} className="delete-form">
                <div className="input-group">
                    <label>Código del Quiz:</label>
                    <input
                        type="text"
                        value={quizCode}
                        onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                        placeholder="Ej: A1B2C3D4"
                        maxLength="8"
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Código de Administrador:</label>
                    <input
                        type="password"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        placeholder="Ingresa el código de seguridad"
                        required
                    />
                </div>

                <button type="submit" className="delete-button">
                    🗑️ Eliminar Permanentemente
                </button>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
            </form>
        </div>
    );
};

export default DeleteQuiz;