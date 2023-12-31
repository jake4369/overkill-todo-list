import express from "express";
const router = express.Router();
import { protect, admin } from "./../middleware/authMiddleware.js";

import {
  createTodo,
  getTodos,
  getMyTodos,
  updateTodoToCompleted,
  deleteTodo,
  deleteCompletedTodos,
} from "./../controllers/todoController.js";

router
  .route("/")
  .post(protect, createTodo)
  .get(protect, admin, getTodos)
  .delete(deleteCompletedTodos);
router.route("/mine").get(protect, getMyTodos);
router
  .route("/:id")
  .put(protect, updateTodoToCompleted)
  .delete(protect, deleteTodo);

export default router;
