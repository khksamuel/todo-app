import apiFetch from "./api";

export interface Todo {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  dueAt: string | null;
  categoryId: number | null;
  categoryName: string | null;
  categoryColour: string | null;
  isDone: boolean;
}

export interface CreateTodoRequest {
  name: string;
  description?: string;
  dueAt?: string;
  categoryId?: number;
}

export interface UpdateTodoRequest {
  name?: string;
  description?: string;
  dueAt?: string;
  categoryId?: number;
}

async function requireTodo(request: Promise<Todo | null>): Promise<Todo> {
  const todo = await request;
  if (todo === null) throw new Error("The API returned an empty todo response.");
  return todo;
}

async function requireTodos(request: Promise<Todo[] | null>): Promise<Todo[]> {
  const todos = await request;
  if (todos === null) throw new Error("The API returned an empty todo list.");
  return todos;
}

/** GET /todos or GET /todos?category={id} */
export function getAllTodos(categoryId?: number): Promise<Todo[]> {
  const path = categoryId === undefined ? "/todos" : `/todos?category=${categoryId}`;
  return requireTodos(apiFetch<Todo[]>(path));
}

/** POST /todos */
export function createTodo(todo: CreateTodoRequest): Promise<Todo> {
  return requireTodo(
    apiFetch<Todo>("/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todo),
    }),
  );
}

/** GET /todos/{id} */
export function getTodoById(id: number): Promise<Todo> {
  return requireTodo(apiFetch<Todo>(`/todos/${id}`));
}

/** DELETE /todos/{id}: soft-deletes one active todo. */
export function deleteTodo(id: number): Promise<void> {
  return apiFetch<void>(`/todos/${id}`, { method: "DELETE" }).then(() => undefined);
}

/** PATCH /todos/{id} */
export function updateTodo(id: number, updates: UpdateTodoRequest): Promise<Todo> {
  return requireTodo(
    apiFetch<Todo>(`/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    }),
  );
}

/** GET /todos/{id}/done */
export function markTodoDone(id: number): Promise<Todo> {
  return requireTodo(apiFetch<Todo>(`/todos/${id}/done`));
}

/** GET /todos/deleted */
export function getDeletedTodos(): Promise<Todo[]> {
  return requireTodos(apiFetch<Todo[]>("/todos/deleted"));
}

/** DELETE /todos/deleted: permanently deletes all soft-deleted todos. */
export function deleteAllDeletedTodos(): Promise<void> {
  return apiFetch<void>("/todos/deleted", { method: "DELETE" }).then(() => undefined);
}

/** DELETE /todos/{id}/permanent: permanently deletes one soft-deleted todo. */
export function permanentlyDeleteTodo(id: number): Promise<void> {
  return apiFetch<void>(`/todos/${id}/permanent`, { method: "DELETE" }).then(() => undefined);
}

/** DELETE /todos/done: soft-deletes all completed todos. */
export function deleteAllDoneTodos(): Promise<void> {
  return apiFetch<void>("/todos/done", { method: "DELETE" }).then(() => undefined);
}

/** DELETE /todos/done/{id}: soft-deletes one completed todo. */
export function deleteDoneTodo(id: number): Promise<void> {
  return apiFetch<void>(`/todos/done/${id}`, { method: "DELETE" }).then(() => undefined);
}

/** DELETE /todos/deleted/{id}: permanently deletes one soft-deleted todo. */
export function permanentlyDeleteDeletedTodo(id: number): Promise<void> {
  return apiFetch<void>(`/todos/deleted/${id}`, { method: "DELETE" }).then(() => undefined);
}

export default {
  getAllTodos,
  createTodo,
  getTodoById,
  deleteTodo,
  updateTodo,
  markTodoDone,
  getDeletedTodos,
  deleteAllDeletedTodos,
  permanentlyDeleteTodo,
  deleteAllDoneTodos,
  deleteDoneTodo,
  permanentlyDeleteDeletedTodo,
};
