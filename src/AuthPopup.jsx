import React, { useState } from "react";

const AuthPopup = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Attempting login...');
      const formData = new URLSearchParams({
        action: 'login',
        email: e.target.email.value,
        password: e.target.password.value,
      });

      console.log('Sending login request...');
      const response = await fetch('http://localhost/osp-project/handle_data.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      console.log('Received response:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Login response data:', data);
      
      if (data.success) {
        console.log('Login successful, storing data...');
        localStorage.setItem('userEmail', e.target.email.value);
        localStorage.setItem('isLoggedIn', 'true');
        console.log('Calling onLogin callback...');
        onLogin();
      } else {
        console.log('Login failed:', data.message);
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Attempting signup...');
      const formData = new URLSearchParams({
        action: 'signup',
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
      });

      const response = await fetch('http://localhost/osp-project/handle_data.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Signup response:', data);
      
      if (data.success) {
        alert("Signup successful! You can now log in.");
        setIsSignup(false);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred during signup. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="card-switch">
        <label className="switch">
          <input 
            type="checkbox" 
            className="toggle" 
            checked={isSignup}
            onChange={() => {
              setIsSignup(!isSignup);
              setError("");
            }} 
          />
          <span className="slider"></span>
          <span className="card-side"></span>
          <div className="flip-card__inner">
            <div className="flip-card__front">
              <div className="title">Log in</div>
              {!isSignup && (
                <form className="flip-card__form" onSubmit={handleLogin}>
                  <input 
                    className="flip-card__input" 
                    name="email" 
                    placeholder="Email" 
                    type="email" 
                    required 
                  />
                  <input 
                    className="flip-card__input" 
                    name="password" 
                    placeholder="Password" 
                    type="password" 
                    required 
                  />
                  {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                  <button 
                    className="flip-card__btn" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : "Let's go!"}
                  </button>
                </form>
              )}
            </div>
            <div className="flip-card__back">
              <div className="title">Sign up</div>
              {isSignup && (
                <form className="flip-card__form" onSubmit={handleSignup}>
                  <input 
                    className="flip-card__input" 
                    name="name" 
                    placeholder="Name" 
                    type="text" 
                    required 
                  />
                  <input 
                    className="flip-card__input" 
                    name="email" 
                    placeholder="Email" 
                    type="email" 
                    required 
                  />
                  <input 
                    className="flip-card__input" 
                    name="password" 
                    placeholder="Password" 
                    type="password" 
                    required 
                  />
                  {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                  <button 
                    className="flip-card__btn" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Confirm!'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default AuthPopup;