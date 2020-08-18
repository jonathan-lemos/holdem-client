import React, {CSSProperties, useState} from "react";
import {range, s} from "./Linq";

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
    Pair= 1,
    TwoPair = 2,
    Set = 3,
    Straight = 5,
    Flush = 5,
    Boat = 6,
    Quads = 7,
    StraightFlush = 8,
}

export interface CardProps {
    rank: Rank,
    suit: Suit
}

export interface CardComponentProps {
    card?: CardProps
    className?: string
    style?: CSSProperties
    animationDurationMs?: number
    animationDelayMs?: number
}

export default function Card(props: CardComponentProps) {
    const delay = props.animationDelayMs ?? 0;
    const dur = props.animationDurationMs ?? 0;
    const noAnimation = delay + dur === 0;

    const [frontClass, setFrontClass] = useState("border bg-white position-absolute frontside");
    const [backClass, setBackClass] = useState("border bg-blue position-relative backside");

    const [frontStyle, setFrontStyle] = useState({
        opacity: noAnimation ? 1 : 0,
        animationDuration: `${dur}ms`,
    });
    const [backStyle, setBackStyle] = useState({
        opacity: noAnimation ? 0 : 1,
        animationDuration: `${dur}ms`
    });

    if (!noAnimation) {
        setTimeout(() => {
            setBackClass(`${backClass} expand-in`);
        }, delay);

        setTimeout(() => {
            setBackClass(backClass.replace("expand-in", "fold-out"));
        }, delay + dur);

        setTimeout(() => {
            setBackStyle(Object.assign({...backStyle}, {opacity: props.card != null ? 0 : 1}));
            setFrontStyle(Object.assign({...frontStyle}, {opacity: props.card != null ? 1 : 0}));
            setFrontClass(`${frontClass} flip-in`);
        }, delay + dur + dur);
    }

    if (props.card == null) {
        return <div className={`${props.className ?? ""} position-relative`}>
            <div className="border bg-blue position-relative backside" style={backStyle}/>
        </div>;
    }

    return <div className={`${props.className ?? ""} position-relative`}>
        <div className={backClass} style={backStyle}/>
        <div className={frontClass} style={frontStyle}>
            <b><span className="size-400">{props.card.rank}-{props.card.suit}</span></b>
        </div>
    </div>;
}

export interface CardViewProps {
    animateRange?: number | [number] | [number, number];
    animationLen?: number;
    cardStaggerLen?: number;
    numTotalCards?: number;
    cards: CardProps[]
}

export function CardView({animateRange, animationLen, cardStaggerLen, numTotalCards, cards}: CardViewProps) {
    if (numTotalCards === undefined || numTotalCards > cards.length) {
        throw new Error("numTotalCards must be >= the number of cards")
    }

    const stagger = cardStaggerLen ?? 0;

    let animate: (number | null)[];
    if (animateRange === undefined) {
        animate = range(numTotalCards).map(_ => null).toArray();
    }
    else if (typeof animateRange === "number") {
        animate = range(numTotalCards).map(i => i === animateRange ? 0 : null).toArray();
    }
    else if (animateRange.length === 1) {
        animate = range(numTotalCards).map(i => i >= animateRange[0] ? (i - animateRange[0]) * stagger : null).toArray();
    }
    else {
        animate = range(numTotalCards).map(i => i >= animateRange[0] && i < animateRange[1] ? (i - animateRange[0]) * stagger : null).toArray();
    }

    const arr = s(cards)
        .zip(animate, (c, a) => ({card: c, animation: a}))
        .map(c => <Card className="p-l" card={c.card} animationDelayMs={c.animation ?? undefined} animationDurationMs={animationLen} />)
        .concat(range(numTotalCards - cards.length).map(_ => <Card className="p-l" />))
        .toArray();
}
