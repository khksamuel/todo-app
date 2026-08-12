import type { Todo } from "../../util/todos";
import "./Card.scss";

function Card({ name, description, dueAt, categoryName, categoryColour, isDone }: Todo) {
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
      <footer>
        <span>{categoryName ?? "No category"}</span>
        <time dateTime={dueAt ?? undefined}>{dueAt ? `Due ${new Date(dueAt).toLocaleString()}` : "No due date"}</time>
      </footer>
    </article>
  );
}

export default Card;
