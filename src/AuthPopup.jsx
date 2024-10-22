import React from "react";

const AuthPopup = ({ onLogin }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="wrapper">
      <div className="card-switch">
        <label className="switch">
          <input type="checkbox" className="toggle" />
          <span className="slider"></span>
          <span className="card-side"></span>
          <div className="flip-card__inner">
            <div className="flip-card__front">
              <div className="title">Log in</div>
              <form className="flip-card__form" onSubmit={handleLogin} method="POST">
                <input className="flip-card__input" name="email" placeholder="Email" type="email" required />
                <input className="flip-card__input" name="password" placeholder="Password" type="password" required />
                <button className="flip-card__btn" type="submit">Let’s go!</button>
              </form>
            </div>
            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form className="flip-card__form" method="POST">
                <input className="flip-card__input" placeholder="Name" type="text" required />
                <input className="flip-card__input" name="email" placeholder="Email" type="email" required />
                <input className="flip-card__input" name="password" placeholder="Password" type="password" required />
                <button className="flip-card__btn" type="submit">Confirm!</button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default AuthPopup;
