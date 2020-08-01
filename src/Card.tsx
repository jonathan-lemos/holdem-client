import React from "react";

export enum Rank {
    Two = "2",
    Three = "3",
    Four = "4",
    Five = "5",
    Six = "6",
    Seven = "7",
    Eight = "8",
    Nine = "9",
    Ten = "T",
    Jack = "J",
    Queen = "Q",
    King = "K",
    Ace = "A"
}

export enum Suit {
    Diamond = "♦",
    Club = "♠",
    Heart = "♥",
    Spade = "♠",
}

export interface CardProps {
    rank: Rank,
    suit: Suit
}

export default class Card extends React.Component<CardProps> {
    private readonly id: string;

    public constructor(props: CardProps) {
        super(props);
        this.id = props.rank + "-" + props.suit;
    }

    public get rank() {
        return this.props.rank;
    }

    public get suit() {
        return this.props.suit;
    }

    public render() {
        return (<div className="border w-100 h-100">
            {this.props.rank}-{this.props.suit}
            </div>)
    }

}
