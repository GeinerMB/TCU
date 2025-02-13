import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizContext } from '../../Contexts/QuizContext';

const LoginForm = () => {
    const [name, setName] = useState(''); // Estado para el nombre del usuario
    const [code, setCode] = useState(''); // Estado para el código del quiz
    const { setUser } = useContext(QuizContext); // Accede a setUser del contexto
    const navigate = useNavigate(); // Hook para redireccionar

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar que se hayan ingresado nombre y código
        if (!name || !code) {
            alert('Por favor, ingresa tu nombre y el código del quiz.');
            return;
        }

        // Determinar si es profesor o estudiante
        const role = code.startsWith('PROF-') ? 'teacher' : 'student';

        // Guardar el usuario en el contexto
        setUser({ name, role, code });

        // Redireccionar según el rol
        if (role === 'teacher') {
            navigate('/teacher'); // Redirige al panel del profesor
        } else {
            navigate(`/quiz/${code}`); // Redirige al quiz del estudiante
        }
    };

    return (
        <div className="login-container">
            <h2>Bienvenido al Nairi Awari Lab</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="login-input"
                />
                <input
                    type="text"
                    placeholder="Código del quiz"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="login-input"
                />
                <button type="submit" className="login-button">
                    Ingresar
                </button>
            </form>

            <div className="login-instructions">
                <p>
                    <strong>Para profesores:</strong> Usa un código que comience con <code>PROF-</code>.
                </p>
                <p>
                    <strong>Para estudiantes:</strong> Ingresa el código proporcionado por tu profesor.
                </p>
            </div>
        </div>
    );
};

export default LoginForm;