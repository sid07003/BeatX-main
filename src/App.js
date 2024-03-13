import './App.css';
import Sidebar from './Components/Sidebar';
import Home from './Screens/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Screens/Login';
import Signup from './Screens/Signup';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<>
            <Sidebar />
            <Home />
          </>}></Route>
          <Route path="/Login" element={<Login />}></Route>
          <Route path="/Signup" element={<Signup />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
