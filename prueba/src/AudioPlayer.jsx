import React, { useRef, useState } from 'react';
import miAudio from './audios/example.mp4'; // Importa el archivo de audio
import playIcon from './images/play.png'; //Importa imagen de play
import stopIcon from './images/stop.png'; //Importa imagen de play
import rewindIcon from './images/rewind.png'; //Importa imagen de play


const AudioPlayer = () => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0); // Estado para el progreso del audio
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
        const currentTime = audioRef.current.currentTime; // Tiempo actual
        const duration = audioRef.current.duration; // Duración total
        setProgress((currentTime / duration) * 100); // Porcentaje de progreso
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current?.duration) {
            setDuration(audioRef.current.duration); // Actualiza la duración una vez cargada
        }
    };

    const handleSeek = (e) => {
        const newTime = (e.target.value / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime; // Actualiza el tiempo del audio
        setProgress(e.target.value);
    };

    const handleRestart = () => {
        audioRef.current.currentTime = 0; // Reinicia el tiempo del audio a 0
        setProgress(0); // Reinicia el progreso
        if (isPlaying) {
            audioRef.current.play(); // Reproduce automáticamente si estaba en reproducción
        }
    };



    return (
        <div>
            <audio
                ref={audioRef}
                src={miAudio}
                onTimeUpdate={handleTimeUpdate} // Escucha el evento para actualizar el progreso
                onLoadedMetadata={handleLoadedMetadata}
            />
            <button onClick={togglePlayPause}>
                <img
                    src={isPlaying ? stopIcon : playIcon}
                    alt={isPlaying ? 'Pausar' : 'Reproducir'}
                    style={{ width: '30px', height: '30px' }}
                />
            </button>
            <button onClick={handleRestart} aria-label="Reiniciar audio">
                <img
                    src={rewindIcon}
                    alt="Reiniciar audio"
                    style={{ width: '30px', height: '30px' }}
                />
            </button>
            <input
                type="range"
                value={progress} // Porcentaje actual del progreso
                onChange={handleSeek} // Permite buscar en el audio
                max="100"
                min="0"
            />
            <span>
                {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} /
                {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
            </span>
        </div>
    );
};

export default AudioPlayer;
