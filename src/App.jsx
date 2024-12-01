import React, { useState, useEffect } from 'react';
import ToDoListApp from "./ToDoListApp.jsx";
import AnalogClock from "./AnalogClock.jsx";
import IdleClicker from "./IdleClicker.jsx";
import AuthPopup from "./AuthPopup.jsx";
import Loader from './Loader.jsx';
import CursorFollower from './CursorFollower.jsx'; // Import the new CursorFollower component
import icon from './assets/icon.png';

function App() {
  // Initialize login state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  });

  // Add new state for loader
  const [showLoader, setShowLoader] = useState(false);

  // Update localStorage when login state changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const handleLogin = () => {
    // Show the loader and set a timeout to hide it after 3 seconds
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
      {/* Add CursorFollower here */}
      <CursorFollower />

      {showLoader ? (
        // Display the loader component if showLoader is true
        <Loader />
      ) : !isLoggedIn ? (
        // Display the AuthPopup if user is not logged in and the loader is not showing
        <AuthPopup onLogin={handleLogin} />
      ) : (
        // Display the app content if the user is logged in and the loader is not showing
        <nav>
          <div className="App">
            <div className="header">
              <img src={icon} alt="no image" className="icon" />
              <button 
                onClick={handleLogout}
                className="logout-button"
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '20px',
                  padding: '8px 16px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
            <div className="content-container">
              <ToDoListApp />
              <AnalogClock />
              <IdleClicker />
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

export default App;