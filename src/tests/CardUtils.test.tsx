import {HandRank, Rank, Suit} from "../Card";
import {bestFive} from "../CardUtils";

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


test('bestFive detects straight flush', () => {
    const hand = [c.TS, c.JS];
    const community = [c["2S"], c.QH, c.QS, c.AS, c.KS];
    const expected = {rank: HandRank.StraightFlush, hand: [c.AS, c.KS, c.QS, c.JS, c.TS]};
    const actual = bestFive(hand.concat(community));

    expect(expected).toEqual(actual);
});

test('bestFive detects quads', () => {
    const hand = [c.TS, c.TH];
    const community = [c.TC, c.JS, c.TD, c.QS, c.KS];
    const expected = {rank: HandRank.Quads, hand: [c.TS, c.TH, c.TC, c.TD, c.KS]};
    const actual = bestFive(hand.concat(community));

    expect(expected).toEqual(actual);
});

test('bestFive detects boats', () => {
    const hand = [c.TS, c.TH];
    const community = [c.TC, c.AS, c.AH, c.AD, c.KS];
    const expected = {rank: HandRank.Boat, hand: [c.AS, c.AH, c.AD, c.TS, c.TH]};
    const actual = bestFive(hand.concat(community));

    expect(expected).toEqual(actual);
});

test('bestFive detects flushes', () => {
    const hand = [c.TH, c.AH];
    const community = [c.JS, c.QH, c.KH, c["2H"], c["5H"]];
    const expected = {rank: HandRank.Flush, hand: [c.AH, c.KH, c.QH, c.TH, c["5H"]]};
    const actual = bestFive(hand.concat(community));

    expect(expected).toEqual(actual);
});

test('bestFive detects straights', () => {
    const hand = [c.TH, c.AS];
    const community = [c.JS, c.QH, c.KH, c["9C"], c["5H"]];
    const expected = {rank: HandRank.Straight, hand: [c.AS, c.KH, c.QH, c.JS, c["TH"]]};
    const actual = bestFive(hand.concat(community));

    expect(expected).toEqual(actual);
});

test('bestFive detects trips', () => {
    const hand = [c.TH, c.TS];
    const community = [c.TD, c["9H"], c["4D"], c.KC, c["5H"]];
    const expected = {rank: HandRank.Set, hand: [c.TS, c.TH, c.TD, c.KC, c["9H"]]};
    const actual = bestFive(hand.concat(community));

    expect(expected).toEqual(actual);
});

test('bestFive detects 2pair', () => {
    const hand = [c.AH, c.KH];
    const community = [c.QC, c["9H"], c.AD, c.KC, c["5H"]];
    const expected = {rank: HandRank.TwoPair, hand: [c.AH, c.AD, c.KH, c.KC, c.QC]};
    const actual = bestFive(hand.concat(community));

    expect(expected).toEqual(actual);
});

test('bestFive detects pair', () => {
    const hand = [c.AH, c.KH];
    const community = [c.QC, c["9H"], c.AD, c["8C"], c["5H"]];
    const expected = {rank: HandRank.Pair, hand: [c.AH, c.AD, c.KH, c.QC, c["9H"]]};
    const actual = bestFive(hand.concat(community));

    expect(expected).toEqual(actual);
});

test('bestFive detects highcard', () => {
    const hand = [c.AH, c.KH];
    const community = [c.QC, c["9H"], c["4C"], c["8C"], c["5H"]];
    const expected = {rank: HandRank.HighCard, hand: [c.AH, c.KH, c.QC, c["9H"], c["8C"]]};
    const actual = bestFive(hand.concat(community));

    expect(expected).toEqual(actual);
});
