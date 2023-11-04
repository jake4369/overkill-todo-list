import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "./../../slices/usersApiSlice";
import { setCredentials } from "./../../slices/authSlice";
import { validateEmail } from "../../utils/utils";

import Loader from "./../Loader";
import ErrorMessage from "../ErrorMessage";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading, error: errorRegister }] = useRegisterMutation();

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
    nameError,
    emailError,
    passwordError,
    emailError,
    passwordError,
    confirmPasswordError,
    errorMessage,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const inputFields = [
      {
        value: name,
        setError: setNameError,
        errorState: nameError,
        fieldName: "name",
        message: "Name cannot be empty",
      },
      {
        value: email,
        setError: setEmailError,
        errorState: emailError,
        fieldName: "email",
        message: "Email cannot be empty",
      },
      {
        value: password,
        setError: setPasswordError,
        errorState: passwordError,
        fieldName: "password",
        message: "Password cannot be empty",
      },
      {
        value: confirmPassword,
        setError: setConfirmPasswordError,
        errorState: confirmPasswordError,
        fieldName: "confirmPassword",
        message: "Please confirm your password",
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

    // Check if email is empty
    if (name === "") {
      setNameError(true);
      setEmailError(false);
      setPasswordError(false);
      setConfirmPasswordError(false);
      setErrorMessage("Please enter name");
      return;
    }

    // Check if email is empty
    if (email === "") {
      setEmailError(true);
      setNameError(false);
      setPasswordError(false);
      setConfirmPasswordError(false);
      setErrorMessage("Please enter email");
      return;
    }

    // Check if password is empty
    if (password === "") {
      setNameError(false);
      setEmailError(false);
      setPasswordError(true);
      setConfirmPasswordError(false);
      setErrorMessage("Please enter password");
      return;
    }

    // Check if password confirm is empty
    if (confirmPassword === "") {
      setNameError(false);
      setEmailError(false);
      setPasswordError(false);
      setConfirmPasswordError(true);
      setErrorMessage("Please confirm your password");
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

    if (password !== confirmPassword) {
      setPasswordError(true);
      setConfirmPasswordError(true);
      setErrorMessage("Passwords do not match");
      return;
    } else {
      setPasswordError(false);
      setConfirmPasswordError(false);
      setErrorMessage("");
    }

    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      setNameError(false);
      setEmailError(false);
      setPasswordError(false);
      setConfirmPasswordError(false);
    } catch (error) {
      if (error.status === 401) {
        setErrorMessage("Invalid email or password");
        setErrorMessage("Invalid email or password");
      } else {
        setErrorMessage(error?.data?.message || error?.error);
      }
      setNameError(true);
      setEmailError(true);
      setPasswordError(true);
      setConfirmPasswordError(true);
    }
  };

  return (
    <div className="screen authscreen registerscreen">
      <h1>Sign Up</h1>

      {isLoading ? (
        <Loader />
      ) : (
        <form onSubmit={submitHandler}>
          <label htmlFor="name">Name</label>
          <input
            type="name"
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={nameError ? "input-error" : ""}
          />

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

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={confirmPasswordError ? "input-error" : ""}
          />

          {errorRegister || errorMessage !== "" ? (
            <ErrorMessage errorClass="error-auth">{errorMessage}</ErrorMessage>
          ) : null}

          <button type="submit" className="screen__btn" disabled={isLoading}>
            Register
          </button>
        </form>
      )}

      <small>
        Already have an account? Login{" "}
        <Link
          to="/login"
          className="login-link"
          aria-label="Click link to go to registration page"
        >
          here
        </Link>
      </small>
    </div>
  );
};

export default RegisterScreen;
