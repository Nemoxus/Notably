import React, { useState, useEffect } from 'react';
import ToDoListApp from "./ToDoListApp.jsx";
import AnalogClock from "./AnalogClock.jsx";
import IdleClicker from "./IdleClicker.jsx";
import Calendar from "./Calendar.jsx"; // Import the Calendar component
import AuthPopup from "./AuthPopup.jsx";
import Loader from './Loader.jsx';
import CursorFollower from './CursorFollower.jsx';
import icon from './assets/icon.png';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const handleLogin = () => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
      setIsLoggedIn(true);
    }, 3000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <div>
      <CursorFollower />
      {showLoader ? (
        <Loader />
      ) : !isLoggedIn ? (
        <AuthPopup onLogin={handleLogin} />
      ) : (
        <nav>
          <div className="App">
            <div className="header">
              <img src={icon} alt="icon" className="icon" />
              <button 
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </button>
            </div>
            <div className="content-container">
              <ToDoListApp />
              <div className="clock-calendar-container">
                <AnalogClock />
                <Calendar />
              </div>
              <IdleClicker />
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

export default App;
