import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useActiveTab } from "./../context/ActiveTabContext";
import { useLogoutMutation } from "./../slices/usersApiSlice";
import { logout } from "./../slices/authSlice";

const LogoutBtn = ({ btnClass }) => {
  const { updateActiveTab } = useActiveTab();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
      updateActiveTab("All");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button className={btnClass} onClick={logoutHandler}>
      Logout
    </button>
  );
};

export default LogoutBtn;
