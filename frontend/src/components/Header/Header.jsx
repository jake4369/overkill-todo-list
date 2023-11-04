import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";

import Nav from "./Nav";

import bgMobileDark from "../../assets/bg-mobile-dark.jpg";
import bgMobileLight from "../../assets/bg-mobile-light.jpg";
import bgDesktopDark from "../../assets/bg-desktop-dark.jpg";
import bgDesktopLight from "../../assets/bg-desktop-light.jpg";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    function handleResize() {
      const isMobileNow = window.innerWidth <= 450;
      setIsMobile(isMobileNow);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const styles = {
    backgroundImage: `url(${
      isDarkMode && isMobile
        ? bgMobileDark
        : isDarkMode && !isMobile
        ? bgDesktopDark
        : !isDarkMode && isMobile
        ? bgMobileLight
        : bgDesktopLight
    })`,
  };

  return (
    <header style={styles}>
      <div className="header__flex-container">
        <h1 className="header__logo">Todo</h1>

        {userInfo && <Nav />}

        <div className="mode-switch__container">
          {isDarkMode ? (
            <button
              className="mode-switch__btn mode-switch__btn-dark"
              onClick={toggleTheme}
            ></button>
          ) : (
            <button
              className="mode-switch__btn mode-switch__btn-light"
              onClick={toggleTheme}
            ></button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
