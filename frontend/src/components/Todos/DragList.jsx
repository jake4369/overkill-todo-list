import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  useGetMyTodosQuery,
  useDeleteAllCompletedTodosMutation,
} from "./../../slices/todosApiSlice";
import { useActiveTab } from "./../../context/ActiveTabContext";
import ListItem from "./ListItem";
import TabBtns from "./TabBtns";
import Loader from "./../Loader";

const DragList = () => {
  const { data: todos, refetch, isLoading, error } = useGetMyTodosQuery();
  const { activeTab } = useActiveTab();
  const [filteredList, setFilteredList] = useState(todos);
  const [itemCount, setItemCount] = useState(filteredList?.length || 0);

  const [deleteAllCompletedTodos, { isLoading: loadingDeleteAllCompleted }] =
    useDeleteAllCompletedTodosMutation();

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

  const handleDragDrop = (results) => {
    const { source, destination } = results;

    if (!destination) {
      return;
    }

    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    if (sourceIndex === destinationIndex) {
      return;
    }

    const updatedList = [...filteredList];

    const [movedItem] = updatedList.splice(sourceIndex, 1);

    updatedList.splice(destinationIndex, 0, movedItem);

    setFilteredList(updatedList);
  };

  return (
    <div className="todo-list">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {filteredList?.length > 0 ? (
            <DragDropContext onDragEnd={handleDragDrop}>
              <Droppable droppableId="ROOT" type="group">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {filteredList.map((item, index) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided) => (
                          <ListItem
                            itemId={item._id}
                            text={item.text}
                            isComplete={item.isComplete}
                            // Pass the props from provided here
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <p className="message">List is empty</p>
          )}
        </>
      )}

      <div className="item-count">
        <span>
          {itemCount} {itemCount === 1 ? "item" : "items"} left
        </span>

        <TabBtns displayClass="tab-btns__desktop" />

        {loadingDeleteAllCompleted ? (
          <Loader loaderClass="icon" />
        ) : (
          <button
            className="clear-completed-btn"
            disabled={loadingDeleteAllCompleted}
            onClick={handleDeleteAllCompleted}
          >
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default DragList;
