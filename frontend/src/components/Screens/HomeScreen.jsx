import { Link } from "react-router-dom";

const HomeScreen = () => {
  return (
    <div className="screen homescreen">
      <p>
        Streamline your day with our Todo app! Boost your productivity and
        reclaim your time. Get organized, get things done.
      </p>

      <Link
        to="/login"
        className="screen__btn homescreen__login-btn"
        aria-label="Click link to go to login page"
      >
        Login
      </Link>

      <small>
        New user? Register{" "}
        <Link
          to="/register"
          className="register-link"
          aria-label="Click link to go to registration page"
        >
          here
        </Link>
      </small>

      <span className="screen__logo" aria-hidden={true}>
        Todo
      </span>
    </div>
  );
};

export default HomeScreen;
