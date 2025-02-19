import React, { useState } from 'react';

const JoinQuiz = () => {
    const [quizCode, setQuizCode] = useState('');
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState('');

    const handleJoinQuiz = () => {
        // Simulamos la validación del código. En un proyecto real, aquí se verifica el código en una base de datos.
        if (quizCode.length === 8) { // Comprobamos que el código tenga una longitud de 8 caracteres
            setJoined(true);
            setError('');
        } else {
            setError('Código inválido. Por favor, ingresa un código de 8 caracteres.');
        }
    };

    return (
        <div className="join-quiz">
            <h2>Unirse a un Quiz</h2>

            {!joined ? (
                <div>
                    <label htmlFor="quizCode">Ingresa el código del Quiz:</label>
                    <input
                        type="text"
                        id="quizCode"
                        value={quizCode}
                        onChange={(e) => setQuizCode(e.target.value)}
                        placeholder="Código del Quiz"
                        maxLength={8} // Limita la longitud a 8 caracteres
                    />
                    <button onClick={handleJoinQuiz}>Unirse</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            ) : (
                <div>
                    <h3>¡Te has unido al quiz con éxito!</h3>
                    <p>Ahora puedes comenzar a responder las preguntas.</p>
                </div>
            )}
        </div>
    );
};

export default JoinQuiz;