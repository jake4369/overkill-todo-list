import asyncHandler from "./../middleware/asyncHandler.js";
import Todo from "./../models/todoModel.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createTodo = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || text === "") {
    res.status(400);
    throw new Error("No text");
  } else {
    const todo = new Todo({
      user: req.user._id,
      text,
      isComplete: false,
    });

    const createTodo = await todo.save();

    res.status(201).json(createTodo);
  }
});

// @desc    Get logged in user todos
// @route   GET /api/todos/mytodos
// @access  Private
const getMyTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });
  res.status(200).json(todos);
});

// @desc    Update todo to complete
// @route   PUT /api/todos/:id
// @access  Private
const updateTodoToCompleted = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (todo) {
    todo.isComplete = !todo.isComplete;

    const updatedTodo = await todo.save();

    res.status(200).json(updatedTodo);
  } else {
    res.status(404);
    throw new Error("Todo not found");
  }
});

// @desc    Delete a todo item
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = asyncHandler(async (req, res) => {
  const todoId = req.params.id;

  const todo = await Todo.findById(todoId);

  if (todo) {
    await Todo.deleteOne({ _id: todoId });
    res.json({ message: "Todo removed" });
  } else {
    res.status(404);
    throw new Error("Todo not found");
  }
});

// @desc    Get all todos
// @route   GET /api/todos
// @access  Private/Admin
const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({}).populate("user", "id name");
  res.status(200).json(todos);
});

// @desc    Delete completed todos
// @route   DELETE /api/todos
// @access  Private
const deleteCompletedTodos = asyncHandler(async (req, res) => {
  try {
    const result = await Todo.deleteMany({ isComplete: true });

    if (result.deletedCount > 0) {
      res.status(204).json({ message: "Completed todos deleted" });
    } else {
      res.status(404).json({ message: "No completed todos found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export {
  createTodo,
  getTodos,
  getMyTodos,
  updateTodoToCompleted,
  deleteTodo,
  deleteCompletedTodos,
};
