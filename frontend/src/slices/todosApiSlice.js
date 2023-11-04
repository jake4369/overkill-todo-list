import { apiSlice } from "./apiSlice";
import { TODOS_URL } from "../constants";

export const todosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTodo: builder.mutation({
      query: (data) => ({
        url: TODOS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Todo"],
    }),
    getMyTodos: builder.query({
      query: () => ({
        url: `${TODOS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Todos"],
    }),
    updateTodo: builder.mutation({
      query: (data) => ({
        url: `${TODOS_URL}/${data.itemId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Todos"],
    }),
    deleteTodo: builder.mutation({
      query: (itemId) => ({
        url: `${TODOS_URL}/${itemId}`,
        method: "DELETE",
      }),
      providesTags: ["Todo"],
    }),
    deleteAllCompletedTodos: builder.mutation({
      query: () => ({
        url: TODOS_URL,
        method: "DELETE",
      }),
      invalidatesTags: ["Todos"],
    }),
    reorderTodos: builder.mutation({
      query: (data) => ({
        url: `${TODOS_URL}/reorder`, // Update the URL to match your server endpoint
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Todos"], // You can adjust the tags as needed
    }),
  }),
});

export const {
  useCreateTodoMutation,
  useGetMyTodosQuery,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useDeleteAllCompletedTodosMutation,
  useReorderTodosMutation,
} = todosApiSlice;
