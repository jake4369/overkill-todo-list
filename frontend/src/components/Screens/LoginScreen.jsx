import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "./../../slices/usersApiSlice";
import { setCredentials } from "./../../slices/authSlice";
import { validateEmail } from "../../utils/utils";

import Loader from "./../Loader";
import ErrorMessage from "../ErrorMessage";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error: errorLogin }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();

  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/todos";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  useEffect(() => {}, [
    emailError,
    passwordError,
    emailError,
    passwordError,
    errorMessage,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const inputFields = [
      {
        value: email,
        setError: setEmailError,
        errorState: emailError,
        fieldName: "email",
      },
      {
        value: password,
        setError: setPasswordError,
        errorState: passwordError,
        fieldName: "password",
      },
    ];

    let hasEmptyField = false;

    inputFields.forEach((field) => {
      console.log(field.message);
      if (field.value === "") {
        field.setError(true);
        hasEmptyField = true;
        setErrorMessage(field.message);
      } else {
        field.setError(false);
        setErrorMessage("");
      }
    });

    if (hasEmptyField) {
      setErrorMessage("Fields cannot be empty");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      setErrorMessage("Invalid email format");
      return;
    } else {
      setEmailError(false);
      setErrorMessage("");
    }

    if (password === "") {
      setPasswordError(true);
      setErrorMessage("Password cannot be empty");
      return;
    } else {
      setPasswordError(false);
      setErrorMessage("");
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      setEmailError(false);
      setPasswordError(false);
    } catch (error) {
      if (error.status === 401) {
        setErrorMessage("Invalid email or password");
        setErrorMessage("Invalid email or password");
      } else {
        setErrorMessage(error?.data?.message || error?.error);
      }
      setEmailError(true);
      setPasswordError(true);
    }
  };

  return (
    <div className="screen authscreen loginscreen">
      <h1>Sign In</h1>

      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={submitHandler}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={emailError ? "input-error" : ""}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? "input-error" : ""}
          />

          {errorLogin || errorMessage !== "" ? (
            <ErrorMessage errorClass="error-auth">{errorMessage}</ErrorMessage>
          ) : null}

          <button type="submit" className="screen__btn" disabled={isLoading}>
            Sign In
          </button>
        </form>
      )}
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
    </div>
  );
};

export default LoginScreen;
