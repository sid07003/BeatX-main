import './App.css';
import { useState, createContext } from 'react';
import Sidebar from './Components/Sidebar';
import Home from './Screens/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import Artist from './Screens/Artist';

export const context_music = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);

  return (
    <div className="App">
      <BrowserRouter>
        <context_music.Provider value={{ isAuthenticated, setIsAuthenticated, albums, setAlbums, likedSongs, setLikedSongs }}>
          <Routes>
            <Route path="/" element={<WithSidebar><Home /></WithSidebar>} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/artist/:artistData" element={<WithSidebar><Artist /></WithSidebar>} />
          </Routes>
        </context_music.Provider>
      </BrowserRouter>
    </div>
  );
}

function WithSidebar({ children }) {
  return (
    <>
      <Sidebar />
      {children}
    </>
  );
}

export default App;
