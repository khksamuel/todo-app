import Card from "../card/Card.tsx";
import type { Todo } from "../../util/todos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "./CardList.scss";

function CardList(props: {
  cards: Todo[];
  filter: string;
  onAddTodo: () => void;
  onMarkDone: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onDuplicate: (id: number) => Promise<void>;
  onEdit: (id: number) => Promise<void>;
}) {
  return (
    <div className="card-list">
      <button
        aria-label="Add new todo"
        className="todo-card todo-card--add"
        onClick={props.onAddTodo}
        type="button"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
      {props.cards
        .filter(
          (card) =>
            props.filter === "" || card.categoryName?.includes(props.filter),
        )
        .map((card) => (
          <Card
            key={card.id}
            {...card}
            onMarkDone={props.onMarkDone}
            onDelete={props.onDelete}
            onDuplicate={props.onDuplicate}
            onEdit={props.onEdit}
          />
        ))}
    </div>
  );
}

export default CardList;
