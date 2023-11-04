import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./../../slices/authSlice";
import {
  useUpdateUserDetailsMutation,
  useDeleteUserMutation,
  useUploadProfileImageMutation,
} from "../../slices/usersApiSlice";
import { useLogoutMutation } from "./../../slices/usersApiSlice";
import { logout } from "./../../slices/authSlice";
import { FaArrowLeft } from "react-icons/fa";
import ErrorMessage from "../ErrorMessage";
import Loader from "../Loader";

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorUpdating, setErrorUpdating] = useState(false);
  const [errorDeleting, setErrorDeleting] = useState(false);
  const [errorUploading, setErrorUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setProfileImage(userInfo.profileImage);
    }
  }, [userInfo, userInfo.name, userInfo.email]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [uploadProfileImage, { isLoading: loadingUpload }] =
    useUploadProfileImageMutation();

  const [updateUserDetails, { isLoading: loadingUpdateDetails }] =
    useUpdateUserDetailsMutation();

  const [deleteUser, { isLoading: loadingDeleteAccount }] =
    useDeleteUserMutation();

  const [logoutApiCall] = useLogoutMutation();

  const uploadFileHandler = async (e) => {
    const fileExtension = e.target.files[0].name.split(".")[1];

    if (
      fileExtension !== "png" &&
      fileExtension !== "jpg" &&
      fileExtension !== "jpeg"
    ) {
      setErrorUploading(true);
      setErrorMessage("Invalid filetype");
      return;
    } else {
      setErrorUploading(false);
      setErrorMessage("");
    }

    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProfileImage(formData).unwrap();
      setProfileImage(res.image);
      setErrorUpdating(false);
    } catch (error) {
      setErrorUpdating(true);
      setErrorMessage(error?.data.message || error.error);
    }
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
    } else {
      try {
        const res = await updateUserDetails({
          _id: userInfo._id,
          name,
          email,
          profileImage,
          password,
        }).unwrap();

        dispatch(setCredentials(res));
        setErrorMessage("");
        setPassword("");
        setConfirmPassword("");
        setErrorUpdating(false);
      } catch (error) {
        setErrorUpdating(true);
        setErrorMessage(error?.data?.message || error?.error);
      }
    }
  };

  const handleDeleteAccount = async (userId) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(userId);
        await logoutApiCall().unwrap();
        dispatch(logout());
        setErrorDeleting(false);
        setErrorMessage("");
        navigate("/");
      } catch (error) {
        setErrorUploading(true);
        setErrorMessage(error?.data?.message || error?.error);
      }
    }
  };

  return (
    <div className="screen profilescreen">
      <Link
        to="/todos"
        className="back-btn"
        aria-label="Click to go back to your todo list"
      >
        <FaArrowLeft />
      </Link>

      <img src={profileImage} alt="" className="profile-img" />

      <h1>{`${userInfo.name.split(" ")[0]}'s Profile`}</h1>

      <form onSubmit={handleUpdateDetails}>
        <p>Edit Details</p>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Edit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="profileImage">Profile Image</label>
        <input
          type="file"
          id="profileImage"
          onChange={uploadFileHandler}
          disabled={loadingUpload}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Edit email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Change password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {errorUpdating || errorUploading || errorDeleting ? (
          <ErrorMessage errorClass="error-auth">{errorMessage}</ErrorMessage>
        ) : null}

        {loadingUpdateDetails ? (
          <Loader />
        ) : (
          <button
            className="screen__btn"
            disabled={loadingUpdateDetails || errorUploading}
          >
            Update
          </button>
        )}
      </form>

      {loadingDeleteAccount ? (
        <Loader />
      ) : errorDeleting ? (
        <ErrorMessage errorClass="error-auth">{errorMessage}</ErrorMessage>
      ) : (
        <button
          className="delete-account-btn"
          onClick={() => handleDeleteAccount(userInfo._id)}
        >
          Delete account
        </button>
      )}
    </div>
  );
};

export default ProfileScreen;
