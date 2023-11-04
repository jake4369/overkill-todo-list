import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <small>
        Challenge by{" "}
        <Link
          to="https://www.frontendmentor.io?ref=challenge"
          target="_blank"
          rel="noreferrer"
          aria-label="Click link to go to Frontend Mentor homepage"
        >
          Frontend Mentor
        </Link>
        . Coded by{" "}
        <Link
          to="https://twitter.com/JakeXCode"
          target="_blank"
          rel="noreferrer"
          aria-label="Click link to go to author's Twitter page"
        >
          JakeXCode
        </Link>{" "}
        {currentYear}
      </small>
    </footer>
  );
};

export default Footer;
