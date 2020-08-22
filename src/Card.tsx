import React, {useState} from "react";
import {range, s} from "./Linq";
import BaseProps from "./BaseProps";
import {animate, animateStyleDefaults, SelectedAnimationProps} from "./Animated";

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

export const RankOrder = Object.freeze([Rank.Two, Rank.Three, Rank.Four, Rank.Five, Rank.Six, Rank.Seven, Rank.Eight, Rank.Nine, Rank.Ten, Rank.Jack, Rank.Queen, Rank.King, Rank.Ace]);

export const RankToOrder = Object.freeze(s(RankOrder).enumerate().toObject(elem => elem.elem, elem => elem.index));

export enum Suit {
    Diamond = "♦",
    Club = "♣",
    Heart = "♥",
    Spade = "♠",
}

export const SuitOrder = Object.freeze([Suit.Diamond, Suit.Club, Suit.Heart, Suit.Spade]);

export const SuitToOrder = Object.freeze(s(SuitOrder).enumerate().toObject(elem => elem.elem, elem => elem.index));

export enum HandRank {
    HighCard = 0,
    Pair = 1,
    TwoPair = 2,
    Set = 3,
    Straight = 5,
    Flush = 5,
    Boat = 6,
    Quads = 7,
    StraightFlush = 8,
}

export interface CardProps {
    rank: Rank;
    suit: Suit;
}

export interface CardComponentProps {
    card?: CardProps;
    entry?: SelectedAnimationProps;
    flipOut?: SelectedAnimationProps;
    flipIn?: SelectedAnimationProps;
    onAnimationComplete?: () => void;
}

export default function Card({card, className, style, entry, flipOut, flipIn, onAnimationComplete}: CardComponentProps & BaseProps) {
    entry = entry ?? {delayMs: 0, durationMs: 100};

    const [frontStyle, setFrontStyle] = useState({...animateStyleDefaults, opacity: 0});
    const [backStyle, setBackStyle] = useState({...animateStyleDefaults, opacity: 1});

    animate(backStyle, setBackStyle, [
        {...(entry ? {...entry, type: "expand-in"} : {type: "none"})},
        {...(flipOut ? {...flipOut, type: "flip-out"} : {type: "none"})},
    ]).then(async () => {
        if (card != null) {
            await animate(frontStyle, setFrontStyle, {...(flipIn ? {...flipIn, type: "flip-in"} : {type: "none"})});
        }
        onAnimationComplete && onAnimationComplete();
    });

    if (card == null) {
        return <div className={`${className ?? ""} position-relative`} style={style}>
            <div className="border bg-blue position-relative backside" style={backStyle}/>
        </div>;
    }

    return <div className={className} style={style}>
        <div className="border bg-blue position-relative backside" style={backStyle}/>
        <div className="border bg-white position-absolute frontside" style={frontStyle}>
            <b><span className="size-400">{card.rank}-{card.suit}</span></b>
        </div>
    </div>;
}

export interface CardViewProps {
    initialCards?: (CardProps | undefined)[];
    maxLen: number;
}

export interface CardState {
    card?: CardProps;
    animated: boolean;
}

export interface CardViewState {
    cards: CardState[];
}

export class CardView extends React.Component<CardViewProps & BaseProps, CardViewState> {
    public constructor(props: CardViewProps & BaseProps) {
        super(props);

        const c = props.initialCards?.map(card => ({card: card, animated: false})) ?? [];
        if (props.maxLen < 0) {
            throw new Error(`maxLen cannot be < 0 (was ${props.maxLen})`);
        }
        if (props.maxLen > c.length) {
            throw new Error(`Number of cards given (${c.length}) exceeds the maxLen (${props.maxLen}).`);
        }

        this.state = {cards: c};
    }

    public push(card: CardProps) {
        if (this.state.cards.length >= this.props.maxLen) {
            throw new Error("This CardView cannot accept any more cards");
        }
        this.setState({cards: this.state.cards.concat({...card, animated: false})});
    }

    public pop(): CardProps | undefined {
        const cpy = [...this.state.cards];
        const last = cpy.pop();
        this.setState({cards: cpy});
        return last?.card;
    }

    public get length() {
        return this.state.cards.length;
    }

    public replace(index: number, card: CardProps) {
        const cpy = [...this.state.cards];
        cpy[index] = {card: card, animated: false};
        this.setState({cards: cpy});
    }

    private setAnimated(index: number, value: boolean = true) {
        const cpy = [...this.state.cards];
        cpy[index] = {...cpy[index], animated: value};
        this.setState({cards: cpy});
    }

    public render() {
        const anim = {durationMs: 100, delayMs: 0};

        return <div className={`flex-row align-center justify-space-between ${this.props.className ?? ""}`} style={this.props.style}>
            {this.state.cards.map((card, i) => {
                const a = card.animated ? anim : undefined;
                const key = card.card ? `${card.card.rank}-${card.card.suit}` : i;
                return <Card card={card.card} className="mx-l" entry={a} flipIn={a} flipOut={a} key={key}
                             onAnimationComplete={() => this.setAnimated(i, false)}/>
            })}
            {range(this.props.maxLen - this.state.cards.length)
                .map(i => <Card className="mx-l invis" key={i}/>)
                .toArray()}
        </div>;
    }
}
