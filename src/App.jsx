import React, { useState } from 'react';
import ToDoListApp from "./ToDoListApp.jsx";
import AnalogClock from "./AnalogClock.jsx";
import IdleClicker from "./IdleClicker.jsx";
import AuthPopup from "./AuthPopup"; // Import the new AuthPopup component
import icon from './assets/icon.png';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  const handleLogin = () => {
    setIsLoggedIn(true); // Set user as logged in after successful login
  };

  return (
    <div>
      {/* Show the login/signup popup if the user is not logged in */}
      {!isLoggedIn && <AuthPopup onLogin={handleLogin} />}

      {/* Show the main content once the user is logged in */}
      {isLoggedIn && (
        <nav>
          <div className="App">
            <img src={icon} alt="no image" className="icon" />
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
