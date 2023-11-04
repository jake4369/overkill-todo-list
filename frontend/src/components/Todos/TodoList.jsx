import { useEffect, useState } from "react";
import {
  useGetMyTodosQuery,
  useDeleteAllCompletedTodosMutation,
} from "./../../slices/todosApiSlice";
import { useActiveTab } from "./../../context/ActiveTabContext";
import ListItem from "./ListItem";
import TabBtns from "./TabBtns";
import Loader from "./../Loader";
import ErrorMessage from "../ErrorMessage";

const TodoList = () => {
  const { data: todos, refetch, isLoading, error } = useGetMyTodosQuery();
  const { activeTab } = useActiveTab();
  const [filteredList, setFilteredList] = useState(todos);
  const [itemCount, setItemCount] = useState(filteredList?.length || 0);

  const [
    deleteAllCompletedTodos,
    { isLoading: loadingDeleteAll, error: errorDeleteAll },
  ] = useDeleteAllCompletedTodosMutation();

  useEffect(() => {
    const list =
      activeTab === "All"
        ? todos
        : activeTab === "Active"
        ? todos.filter((item) => !item.isComplete)
        : todos.filter((item) => item.isComplete);

    setFilteredList(list);
  }, [activeTab, todos]);

  useEffect(() => {
    const count =
      activeTab === "All"
        ? filteredList?.length
        : activeTab === "Active"
        ? filteredList?.filter((item) => !item.isComplete).length
        : filteredList?.filter((item) => item.isComplete).length || 0;

    setItemCount(count);
  }, [activeTab, filteredList]);

  const handleDeleteAllCompleted = async () => {
    const completedTodos =
      todos && todos.filter((item) => item.isComplete).length > 0;
    try {
      if (completedTodos) {
        await deleteAllCompletedTodos();
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="todo-list">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage errorClass="error-list">
          An error occured while fetching your list. Please refresh the page and
          try again.
        </ErrorMessage>
      ) : (
        <>
          {filteredList?.length > 0 ? (
            <div>
              {filteredList.map((item, index) => (
                <ListItem
                  key={item._id}
                  itemId={item._id}
                  text={item.text}
                  isComplete={item.isComplete}
                />
              ))}
            </div>
          ) : (
            <p className="empty-message">List is empty</p>
          )}
        </>
      )}

      <div className="item-count">
        <span>
          {itemCount} {itemCount === 1 ? "item" : "items"} left
        </span>

        <TabBtns displayClass="tab-btns__desktop" />

        {errorDeleteAll ? (
          <ErrorMessage errorClass="error-delete-all">
            Error. Refresh.
          </ErrorMessage>
        ) : loadingDeleteAll ? (
          <Loader loaderClass="icon" />
        ) : (
          <button
            className="clear-completed-btn"
            disabled={loadingDeleteAll}
            onClick={handleDeleteAllCompleted}
          >
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoList;
