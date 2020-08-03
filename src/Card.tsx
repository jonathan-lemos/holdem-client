import React from "react";
import {enumerate, range, toObject, zip} from "./Linq";

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

export const RankToOrder: Readonly<{ [key: Rank]: number }> = Object.freeze(toObject(enumerate(RankOrder), elem => elem[1], elem => elem[0]))

export enum Suit {
    Diamond = "♦",
    Club = "♠",
    Heart = "♥",
    Spade = "♠",
}

export const SuitOrder = Object.freeze([Suit.Diamond, Suit.Club, Suit.Heart, Suit.Spade]);

export const SuitToOrder: Readonly<{ [key: Suit]: number }> = Object.freeze(toObject(enumerate(SuitOrder), elem => elem[1], elem => elem[0]))

export enum HandType {
    StraightFlush,
    Quads,
    Boat,
    Flush,
    Straight,
    Set,
    TwoPair,
    Pair,
    HighCard
}

export interface CardProps {
    rank: Rank,
    suit: Suit
}

module CardUtils {
    const sort = (cards: CardProps[]): CardProps[]
    {
        const ret = [...cards];
        ret.sort((a, b) => {
            if (a.rank !== b.rank) {
                return a.rank
            }
        })
    }

    const bestFive = (cards: CardProps[]) => {

    }

    export function compare(
        community: [CardProps, CardProps, CardProps, CardProps, CardProps],
        ...hands: [CardProps, CardProps][]): [number, [CardProps, CardProps, CardProps, CardProps, CardProps]] {

    }
}

export default function Card({rank, suit}: CardProps) {
    return (<div className="border w-100 h-100">
        {rank}-{suit}
    </div>)
}
