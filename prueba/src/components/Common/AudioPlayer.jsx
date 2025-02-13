import React, { useRef, useState, useEffect, useContext } from 'react';
import { QuizContext } from '../../Contexts/QuizContext.jsx';
import playIcon from '../../images/play.png';
import stopIcon from '../../images/stop.png';
import rewindIcon from '../../images/rewind.png';

const AudioPlayer = ({ audioURL }) => {
    const { user, quizzes } = useContext(QuizContext);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Efecto para resetear al cambiar de audio
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            setProgress(0);
            setCurrentTime(0);
        }
    }, [audioURL]);

    const togglePlayPause = () => {
        if (!audioURL) return; // Previene errores si no hay audio

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration || 1; // Evita división por cero
        setCurrentTime(current);
        setProgress((current / total) * 100);
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current?.duration) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        if (!audioURL) return;
        const newTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = newTime;
    };

    const handleRestart = () => {
        if (!audioURL) return;
        audioRef.current.currentTime = 0;
        setProgress(0);
        if (isPlaying) audioRef.current.play();
    };

    // Para profesores: muestra controles básicos
    // Para estudiantes: muestra todos los controles
    const isTeacherView = user?.role === 'teacher';

    return (
        <div className="audio-player-container">
            <audio
                ref={audioRef}
                src={audioURL}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="player-controls">
                {!isTeacherView && (
                    <button onClick={handleRestart} aria-label="Reiniciar">
                        <img src={rewindIcon} alt="Reiniciar" />
                    </button>
                )}

                <button
                    onClick={togglePlayPause}
                    disabled={!audioURL}
                >
                    <img
                        src={isPlaying ? stopIcon : playIcon}
                        alt={isPlaying ? 'Pausar' : 'Reproducir'}
                    />
                </button>

                {!isTeacherView && (
                    <>
                        <input
                            type="range"
                            value={progress}
                            onChange={handleSeek}
                            min="0"
                            max="100"
                            disabled={!audioURL}
                        />
                        <div className="time-display">
                            {`${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')} / 
                            ${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`}
                        </div>
                    </>
                )}
            </div>

            {!audioURL && user?.role === 'teacher' && (
                <p className="upload-message">⚠️ Sube un archivo de audio en el panel de edición</p>
            )}
        </div>
    );
};

export default AudioPlayer;