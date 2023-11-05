import { useSelector } from "react-redux";

import CreateTodoForm from "./../Todos/CreateTodoForm";
import TodoList from "./../Todos/TodoList";
import TabBtns from "./../Todos/TabBtns";
import LogoutBtn from "../LogoutBtn";

const TodoScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  return (
    <div className="screen todoscreen">
      <div className="profile-img__container">
        <img
          src={
            userInfo.profileImage
              ? userInfo.profileImage
              : "/images/profile.jpeg"
          }
          alt=""
          className="profile-img"
        />
      </div>
      <p className="welcome-message">Welcome {userInfo.name.split(" ")[0]}</p>
      <CreateTodoForm />

      <TodoList />

      <TabBtns displayClass="tab-btns__mobile" />

      <LogoutBtn btnClass="logout-btn__mobile" />
    </div>
  );
};

export default TodoScreen;
