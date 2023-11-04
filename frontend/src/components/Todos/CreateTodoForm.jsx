import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetMyTodosQuery,
  useCreateTodoMutation,
} from "./../../slices/todosApiSlice.js";
import { useActiveTab } from "./../../context/ActiveTabContext";
import { toast } from "react-toastify";
import { FaCirclePlus } from "react-icons/fa6";
import Loader from "./../Loader";
import ErrorMessage from "../ErrorMessage.jsx";

const CreateTodoForm = () => {
  const { refetch, isLoading, error } = useGetMyTodosQuery();
  const { updateActiveTab } = useActiveTab();
  const [createTodo, { isLoading: loadingCreate, error: errorCreate }] =
    useCreateTodoMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [text, setText] = useState("");

  const handleCreateItem = async (e) => {
    e.preventDefault();
    const user = userInfo._id;
    try {
      if (text !== "") {
        await createTodo({ user, text });
        setText("");
        refetch();
        updateActiveTab("All");
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.error);
    }
  };

  return (
    <>
      {errorCreate ? (
        <ErrorMessage errorClass="input-error">
          An error occured while creating a list item. Please refresh the page
          and try again.
        </ErrorMessage>
      ) : (
        <form
          className="todo-screen__input-container"
          onSubmit={handleCreateItem}
        >
          {loadingCreate ? (
            <Loader loaderClass="icon input-loader" />
          ) : (
            <button
              className="create-todo-btn"
              aria-label="Click button to create a new list item"
              type="submit"
            >
              <FaCirclePlus />
            </button>
          )}
          <input
            type="text"
            placeholder="Create a new todo…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </form>
      )}
    </>
  );
};

export default CreateTodoForm;
