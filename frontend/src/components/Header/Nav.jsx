import { Link, useLocation } from "react-router-dom";
import LogoutBtn from "../LogoutBtn";

const Nav = () => {
  const location = useLocation();
  const isTodosPage = location.pathname.endsWith("/todos");

  return (
    <nav>
      {/* MOBILE NAV */}
      <div className="nav__mobile">
        <Link to="/todos" className={isTodosPage ? "active-link" : ""}>
          Todo's
        </Link>
        <Link to="/profile" className={isTodosPage ? "" : "active-link"}>
          Profile
        </Link>
      </div>

      {/* DESKTOP NAV */}
      <div className="nav__desktop">
        <Link to="/todos" className={isTodosPage ? "active-link" : ""}>
          Todo's
        </Link>
        <Link to="/profile" className={isTodosPage ? "" : "active-link"}>
          Profile
        </Link>
        <LogoutBtn btnClass="logout-btn__desktop" />
      </div>
    </nav>
  );
};

export default Nav;
