import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { Todo } from "../../util/todos";
import "./Card.scss";

interface CardProps extends Todo {
  onMarkDone: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onDuplicate: (id: number) => Promise<void>;
  onEdit: (id: number) => Promise<void>;
}

function Card({ id, name, description, dueAt, categoryColour, isDone, onMarkDone, onDelete, onDuplicate, onEdit }: CardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const runAction = async (action: (id: number) => Promise<void>): Promise<void> => {
    try {
      setError("");
      setIsUpdating(true);
      await action(id);
    } catch (actionError: unknown) {
      setError(actionError instanceof Error ? actionError.message : "Unable to update this todo.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <article className={`todo-card${isDone ? " todo-card--done" : ""}`}>
      <span
        aria-hidden="true"
        className="todo-card__ribbon"
        style={{ borderTopColor: categoryColour ?? "#9ca3af" }}
      />
      <div className="todo-card__heading">
        <h2>{name}</h2>
        {isDone && <span>Done</span>}
      </div>
      {description && <p>{description}</p>}
      {error && <p className="todo-card__error">{error}</p>}
      <footer>
        {/* <span>{categoryName ?? "No category"}</span> */}
        <div className="todo-card__footer-actions">
          <time dateTime={dueAt ?? undefined}>{dueAt ? `Due ${new Date(dueAt).toLocaleString()}` : "No due date"}</time>
          <div className="todo-card__actions">
            {!isDone && (
              <button aria-label={`Mark ${name} as done`} disabled={isUpdating} onClick={() => void runAction(onMarkDone)} type="button">
                <FontAwesomeIcon icon={faCheck} />
              </button>
            )}
            <button aria-label={`Delete ${name}`} disabled={isUpdating} onClick={() => void runAction(onDelete)} type="button">
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button aria-label={`Duplicate ${name}`} disabled={isUpdating} onClick={() => void runAction(onDuplicate)} type="button">
              <FontAwesomeIcon icon={faCopy} />
            </button>
            <button aria-label={`Edit ${name}`} disabled={isUpdating} onClick={() => void runAction(onEdit)} type="button">
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
}

export default Card;
