import Card from "../card/Card.tsx";

interface CardInterface {
    id: number;
    title: string;
    description: string;
}

function CardList(props: { cards: CardInterface[] }) {
    return (
        <div className="card-list">
            {props.cards.map((card) => (
                <Card key={card.id} {...card} />
            ))}
        </div>
    );
}

export default CardList;