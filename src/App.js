import './App.css';
import { useState, createContext } from 'react';
import Sidebar from './Components/Sidebar';
import Home from './Screens/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Artist from './Screens/Artist';
import MusicPlayer from './Components/MusicPlayer';

export const context_music = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [currently_playing_music, set_currently_playing_music] = useState({});
  const [musicPlayer, setmusicPlayer] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicClicked, setIsMusicClicked] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <context_music.Provider value={{
          isAuthenticated, setIsAuthenticated, albums, setAlbums, likedSongs, setLikedSongs,
          currently_playing_music, set_currently_playing_music, musicPlayer, setmusicPlayer,
          isMusicPlaying, setIsMusicPlaying, isMusicClicked, setIsMusicClicked
        }}>
          <Routes>
            <Route path="/" element={<WithSidebar currently_playing_music={currently_playing_music}><Home /></WithSidebar>} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/artist/:artistData" element={<WithSidebar currently_playing_music={currently_playing_music}><Artist /></WithSidebar>} />
          </Routes>
        </context_music.Provider>
      </BrowserRouter>
    </div>
  );
}

function WithSidebar({ currently_playing_music, children }) {
  return (
    <>
      <Sidebar />
      {Object.keys(currently_playing_music).length > 0 && <MusicPlayer />}
      {children}
    </>
  );
}

export default App;
