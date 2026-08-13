import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getCategories, type Category } from "../../util/category";
import { createTodo, updateTodo, type Todo } from "../../util/todos";
import "../category/CategoryDialog.scss";
import "./TodoDialog.scss";

interface TodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  todoToEdit?: Todo | null;
}

function TodoDialog({ isOpen, onClose, onSaved, todoToEdit }: TodoDialogProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(() => todoToEdit?.name ?? "");
  const [description, setDescription] = useState(() => todoToEdit?.description ?? "");
  const [dueAt, setDueAt] = useState(() => todoToEdit?.dueAt?.slice(0, 19) ?? "");
  const [categoryId, setCategoryId] = useState(() => todoToEdit?.categoryId ? String(todoToEdit.categoryId) : "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    nameInputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    void getCategories()
      .then(setCategories)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load categories.");
      });

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const close = (): void => {
    if (isSaving) return;
    setError("");
    onClose();
  };

  const handleSubmit = async (): Promise<void> => {
    if (!name.trim()) return;

    try {
      setError("");
      setIsSaving(true);
      const todoDetails = {
        name: name.trim(),
        description: description.trim() || undefined,
        dueAt: dueAt || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
      };

      if (todoToEdit) {
        await updateTodo(todoToEdit.id, todoDetails);
      } else {
        await createTodo(todoDetails);
      }
      onSaved();
      onClose();
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : "Unable to create the todo.");
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div className="category-dialog-backdrop" role="presentation" onMouseDown={close}>
      <div
        aria-labelledby="todo-dialog-title"
        aria-modal="true"
        className="category-dialog todo-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <h3 id="todo-dialog-title">{todoToEdit ? "Edit todo" : "Add todo"}</h3>
        <label>
          Name
          <input ref={nameInputRef} value={name} onChange={(event) => setName(event.target.value)} placeholder="Todo name" />
        </label>
        <label>
          Description
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Optional description" rows={4} />
        </label>
        <label>
          Due date
          <input type="datetime-local" value={dueAt} onChange={(event) => setDueAt(event.target.value)} step="1" />
        </label>
        <label>
          Category
          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">No category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
        {error && <p>{error}</p>}
        <div className="category-dialog__actions">
          <button type="button" onClick={close} disabled={isSaving}>Cancel</button>
          <button type="button" onClick={() => void handleSubmit()} disabled={isSaving || !name.trim()}>
            {isSaving ? "Saving..." : todoToEdit ? "Save changes" : "Add todo"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default TodoDialog;
