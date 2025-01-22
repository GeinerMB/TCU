import logo from './images/wind.png';
import './App.css';
import AudioPlayer from './AudioPlayer';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Nairi Awari lab
        </p>
        <AudioPlayer />
      </header>
    </div>
  );
}

export default App;
