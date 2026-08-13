import DropDownMenu from "../filter/DropDownMenu/DropDownMenu.tsx";
import CardList from "../cardList/CardList.tsx";
import { deleteTodo, getAllTodos, markTodoDone, duplicateTodo, type Todo } from "../../util/todos.ts";
import { useEffect, useState } from "react";
import TodoDialog from "../todo/TodoDialog";

function Search() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [filter, setFilter] = useState("");
  const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);

  useEffect(() => {
    void getAllTodos(categoryId).then(setTodos);
  }, [categoryId]);

  const refreshTodos = async (): Promise<void> => {
    setTodos(await getAllTodos(categoryId));
  };

  return (
    <>
      <DropDownMenu
        onCategoryChange={(nextCategoryId, nextFilter) => {
          setCategoryId(nextCategoryId);
          setFilter(nextFilter);
        }}
      />
      <CardList
        cards={todos}
        filter={filter}
        onAddTodo={() => {
          setTodoToEdit(null);
          setIsTodoDialogOpen(true);
        }}
        onMarkDone={async (id) => {
          await markTodoDone(id);
          await refreshTodos();
        }}
        onDelete={async (id) => {
          await deleteTodo(id);
          await refreshTodos();
        }}
        onDuplicate={async (id) => {
          const todoToDuplicate = todos.find((todo) => todo.id === id);
          if (todoToDuplicate) {
            await duplicateTodo(todoToDuplicate);
            await refreshTodos();
          }
        }}
        onEdit={async (id) => {
          const todoToEdit = todos.find((todo) => todo.id === id);
          if (todoToEdit) {
            setTodoToEdit(todoToEdit);
            setIsTodoDialogOpen(true);
          }
        }}
      />
      <TodoDialog
        key={todoToEdit?.id ?? "new"}
        isOpen={isTodoDialogOpen}
        onClose={() => {
          setIsTodoDialogOpen(false);
          setTodoToEdit(null);
        }}
        onSaved={() => void refreshTodos()}
        todoToEdit={todoToEdit}
      />
    </>
  );
}

export default Search;
