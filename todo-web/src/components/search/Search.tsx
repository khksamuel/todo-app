import DropDownMenu from "../filter/DropDownMenu/DropDownMenu.tsx";
import CardList from "../cardList/CardList.tsx";
import { getAllTodos, type Todo } from "../../util/todos.ts";
import { useEffect, useState } from "react";
import TodoDialog from "../todo/TodoDialog";

function Search() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [filter, setFilter] = useState("");
  const [isTodoDialogOpen, setIsTodoDialogOpen] = useState(false);

  useEffect(() => {
    void getAllTodos(categoryId).then(setTodos);
  }, [categoryId]);

  return (
    <>
      <DropDownMenu
        onCategoryChange={(nextCategoryId, nextFilter) => {
          setCategoryId(nextCategoryId);
          setFilter(nextFilter);
        }}
      />
      <CardList cards={todos} filter={filter} onAddTodo={() => setIsTodoDialogOpen(true)} />
      <TodoDialog
        isOpen={isTodoDialogOpen}
        onClose={() => setIsTodoDialogOpen(false)}
        onCreated={() => void getAllTodos(categoryId).then(setTodos)}
      />
    </>
  );
}

export default Search;
