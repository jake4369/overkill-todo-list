import React from "react";

import {
  useGetMyTodosQuery,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "./../../slices/todosApiSlice";
import { useSelector } from "react-redux";

import Loader from "./../Loader";
import ErrorMessage from "../ErrorMessage";

const ListItem = React.forwardRef(
  ({ itemId, text, isComplete, ...dragProps }, ref) => {
    const { data: todos, refetch } = useGetMyTodosQuery();
    const { userInfo } = useSelector((state) => state.auth);

    const [updateTodo, { isLoading, error: updatingError }] =
      useUpdateTodoMutation();

    const [deleteTodo, { isLoading: loadingDelete, error: deleteError }] =
      useDeleteTodoMutation();

    const handleUpdateItem = async (itemId) => {
      try {
        const item = todos.find((item) => item._id === itemId);
        const user = userInfo._id;

        if (item) {
          updateTodo({ itemId, user, text, isComplete }).then(() => {
            refetch();
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleDeleteItem = async (itemId) => {
      try {
        await deleteTodo(itemId);
        refetch();
      } catch (error) {
        console.log(error);
      }
    };

    return (
      <div
        className={`todo-list__item ${isComplete ? "complete" : ""}`}
        ref={ref}
        {...dragProps}
      >
        {isComplete ? (
          <>
            {isLoading ? (
              <Loader loaderClass="icon" />
            ) : (
              <button
                className="checkbox checked"
                onClick={() => handleUpdateItem(itemId)}
              ></button>
            )}
          </>
        ) : (
          <>
            {isLoading ? (
              <Loader loaderClass="icon" />
            ) : (
              <button
                className="checkbox"
                onClick={() => handleUpdateItem(itemId)}
              ></button>
            )}
          </>
        )}

        {updatingError ? (
          <ErrorMessage errorClass="error-updating">
            Error occured while updating. Refresh and try again.
          </ErrorMessage>
        ) : deleteError ? (
          <ErrorMessage errorClass="error-deleting-item">
            Error occured while deleting. Refresh and try again.
          </ErrorMessage>
        ) : (
          <span>{text}</span>
        )}

        {loadingDelete ? (
          <Loader loaderClass="loader__delete-btn" />
        ) : (
          <button
            className="delete-item-btn"
            onClick={() => handleDeleteItem(itemId)}
          ></button>
        )}
      </div>
    );
  }
);

export default ListItem;
