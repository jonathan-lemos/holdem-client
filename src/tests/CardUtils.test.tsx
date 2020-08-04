import {CardProps, HandRank, Rank, Suit} from "../Card";
import {bestFive, handSort} from "../CardUtils";

// const c = (rank: Rank, suit: Suit) => ({rank, suit});

const c = {
    "2D": {"rank": Rank.Two, "suit": Suit.Diamond},
    "2C": {"rank": Rank.Two, "suit": Suit.Club},
    "2H": {"rank": Rank.Two, "suit": Suit.Heart},
    "2S": {"rank": Rank.Two, "suit": Suit.Spade},
    "3D": {"rank": Rank.Three, "suit": Suit.Diamond},
    "3C": {"rank": Rank.Three, "suit": Suit.Club},
    "3H": {"rank": Rank.Three, "suit": Suit.Heart},
    "3S": {"rank": Rank.Three, "suit": Suit.Spade},
    "4D": {"rank": Rank.Four, "suit": Suit.Diamond},
    "4C": {"rank": Rank.Four, "suit": Suit.Club},
    "4H": {"rank": Rank.Four, "suit": Suit.Heart},
    "4S": {"rank": Rank.Four, "suit": Suit.Spade},
    "5D": {"rank": Rank.Five, "suit": Suit.Diamond},
    "5C": {"rank": Rank.Five, "suit": Suit.Club},
    "5H": {"rank": Rank.Five, "suit": Suit.Heart},
    "5S": {"rank": Rank.Five, "suit": Suit.Spade},
    "6D": {"rank": Rank.Six, "suit": Suit.Diamond},
    "6C": {"rank": Rank.Six, "suit": Suit.Club},
    "6H": {"rank": Rank.Six, "suit": Suit.Heart},
    "6S": {"rank": Rank.Six, "suit": Suit.Spade},
    "7D": {"rank": Rank.Seven, "suit": Suit.Diamond},
    "7C": {"rank": Rank.Seven, "suit": Suit.Club},
    "7H": {"rank": Rank.Seven, "suit": Suit.Heart},
    "7S": {"rank": Rank.Seven, "suit": Suit.Spade},
    "8D": {"rank": Rank.Eight, "suit": Suit.Diamond},
    "8C": {"rank": Rank.Eight, "suit": Suit.Club},
    "8H": {"rank": Rank.Eight, "suit": Suit.Heart},
    "8S": {"rank": Rank.Eight, "suit": Suit.Spade},
    "9D": {"rank": Rank.Nine, "suit": Suit.Diamond},
    "9C": {"rank": Rank.Nine, "suit": Suit.Club},
    "9H": {"rank": Rank.Nine, "suit": Suit.Heart},
    "9S": {"rank": Rank.Nine, "suit": Suit.Spade},
    "TD": {"rank": Rank.Ten, "suit": Suit.Diamond},
    "TC": {"rank": Rank.Ten, "suit": Suit.Club},
    "TH": {"rank": Rank.Ten, "suit": Suit.Heart},
    "TS": {"rank": Rank.Ten, "suit": Suit.Spade},
    "JD": {"rank": Rank.Jack, "suit": Suit.Diamond},
    "JC": {"rank": Rank.Jack, "suit": Suit.Club},
    "JH": {"rank": Rank.Jack, "suit": Suit.Heart},
    "JS": {"rank": Rank.Jack, "suit": Suit.Spade},
    "QD": {"rank": Rank.Queen, "suit": Suit.Diamond},
    "QC": {"rank": Rank.Queen, "suit": Suit.Club},
    "QH": {"rank": Rank.Queen, "suit": Suit.Heart},
    "QS": {"rank": Rank.Queen, "suit": Suit.Spade},
    "KD": {"rank": Rank.King, "suit": Suit.Diamond},
    "KC": {"rank": Rank.King, "suit": Suit.Club},
    "KH": {"rank": Rank.King, "suit": Suit.Heart},
    "KS": {"rank": Rank.King, "suit": Suit.Spade},
    "AD": {"rank": Rank.Ace, "suit": Suit.Diamond},
    "AC": {"rank": Rank.Ace, "suit": Suit.Club},
    "AH": {"rank": Rank.Ace, "suit": Suit.Heart},
    "AS": {"rank": Rank.Ace, "suit": Suit.Spade}
};

const s = (s: CardProps[]) => handSort(s);

const ss = (p: [HandRank, CardProps[]]) => {
    const sss = s(p[1]);
    return [p[0], sss];
}

test('bestFive detects straight flush', () => {
    const hand = [c.TS, c.JS];
    const community = [c["2S"], c.QH, c.QS, c.AS, c.KS];
    const expected: [HandRank, CardProps[]] = [HandRank.StraightFlush, [c.TS, c.JS, c.QS, c.KS, c.AS]];
    const actual: [HandRank, CardProps[]] = bestFive(hand.concat(community));

    expect(ss(expected)).toEqual(ss(actual));
});

test('bestFive detects quads', () => {
    const hand = [c.TS, c.TH];
    const community = [c.TC, c.JS, c.TD, c.QS, c.KS];
    const expected: [HandRank, CardProps[]] = [HandRank.Quads, [c.TS, c.TH, c.TD, c.TC, c.KS]];
    const actual: [HandRank, CardProps[]] = bestFive(hand.concat(community));

    expect(ss(expected)).toEqual(ss(actual));
});