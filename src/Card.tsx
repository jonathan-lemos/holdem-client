import React from "react";
import {enumerate, toObject} from "./Linq";

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

export const RankToOrder = Object.freeze(toObject(enumerate(RankOrder), elem => elem.elem, elem => elem.index))

export enum Suit {
    Diamond = "♦",
    Club = "♣",
    Heart = "♥",
    Spade = "♠",
}

export const SuitOrder = Object.freeze([Suit.Diamond, Suit.Club, Suit.Heart, Suit.Spade]);

export const SuitToOrder = Object.freeze(toObject(enumerate(SuitOrder), elem => elem.elem, elem => elem.index))

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

export default function Card({rank, suit}: CardProps) {
    return (<div className="border w-100 h-100">
        {rank}-{suit}
    </div>)
}
