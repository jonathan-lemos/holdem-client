import {any, argMax, first, firstOrUndefined, groupBy, none, range, valueMap} from "./Linq";
import {deepEqual} from "./Misc";
import {CardProps, HandRank, Rank, RankToOrder, SuitToOrder} from "./Card";

export const handSort = (cards: CardProps[]): CardProps[] => {
    const ret = [...cards];
    ret.sort((a, b) => {
        const [aro, bro] = [RankToOrder[a.rank], RankToOrder[b.rank]];
        if (aro - bro !== 0) {
            return bro - aro;
        }
        const [as, bs] = [SuitToOrder[a.suit], SuitToOrder[b.suit]];
        return bs - as;
    });
    return ret;
}

export const isStraight = (cards: CardProps[]): boolean => {
    const sorted = handSort(cards);

    if (cards.length < 2) {
        return true;
    }

    let prev = RankToOrder[sorted[0].rank];

    for (let i = 1; i < sorted.length - 1; ++i) {
        let cur = RankToOrder[sorted[i].rank];
        if (cur !== prev - 1) {
            return false;
        }
        prev = cur;
    }

    if (cards[0].rank === Rank.Two && cards[cards.length - 1].rank === Rank.Ace) {
        return true;
    }

    return RankToOrder[cards[cards.length - 1].rank] === prev - 1;
}

export const bestFive = (cards: CardProps[]): [HandRank, [CardProps, CardProps, CardProps, CardProps, CardProps]] => {
    const suits = valueMap(groupBy(cards, c => c.suit), handSort);
    const ranks = valueMap(groupBy(cards, c => c.rank), handSort);

    const maxSuit = Object.keys(suits).reduce((a, c) => a.length >= suits[c].length ? a : suits[c], [] as CardProps[]);
    const maxRank = Object.keys(ranks).reduce((a, c) => a.length >= ranks[c].length ? a : ranks[c], [] as CardProps[]);

    if (maxSuit.length >= 5) {
        const res = firstOrUndefined(range(maxSuit.length - 5).map(n => maxSuit.slice(n, n + 5)), isStraight);
        if (res !== undefined) {
            return [HandRank.StraightFlush, res as [CardProps, CardProps, CardProps, CardProps, CardProps]];
        }
    }

    if (maxRank.length === 4) {
        const lastCard = handSort(cards.filter(card => none(maxRank, mcard => deepEqual(mcard, card))))[0];
        return [HandRank.Quads, [...maxRank, lastCard] as [CardProps, CardProps, CardProps, CardProps, CardProps]];
    }

    const trips = Object.keys(ranks).map(k => ranks[k]).filter(a => a.length === 3).sort((a, b) => RankToOrder[a[0].rank] - RankToOrder[b[0].rank]);
    const pairs = Object.keys(ranks).map(k => ranks[k]).filter(a => a.length === 2).sort((a, b) => RankToOrder[a[0].rank] - RankToOrder[b[0].rank]);

    if (trips.length > 0 && trips.length + pairs.length >= 2) {
        const trip = trips.pop() as CardProps[];
        const pair = trips.concat(pairs).reduce((a, c) => RankToOrder[a[0].rank] >= RankToOrder[c[0].rank] ? a : c);

        return [HandRank.Boat, trip.concat(pair) as [CardProps, CardProps, CardProps, CardProps, CardProps]];
    }

    if (any(Object.values(suits), suit => suit.length >= 5)) {
        const candidates = Object.values(suits).filter(suit => suit.length >= 5).map(handSort);
        const candTmp = candidates.map(x => [...x]);
        while (candTmp[0].length > 0) {
            let maxRanks = argMax(candTmp.map(x => x[0]), x => RankToOrder[x.rank]);
            if (maxRanks.length === 1) {
                return [HandRank.Flush, first(candidates, c => c[0].suit === maxRanks[0].suit) as [CardProps, CardProps, CardProps, CardProps, CardProps]];
            }
        }
        return [HandRank.Flush, candidates.sort((a, b) => SuitToOrder[a[0].suit] - SuitToOrder[b[0].suit])[0] as [CardProps, CardProps, CardProps, CardProps, CardProps]];
    }

    const sorted = handSort(cards);
    for (let i = sorted.length - 5; i >= 0; --i) {
        const candidate = (sorted[i].rank === Rank.Two && sorted[sorted.length - 1].rank === Rank.Ace) ?
            sorted.slice(i, i + 4).concat([sorted[sorted.length - 1]]) :
            sorted.slice(i, i + 5);

        if (isStraight(candidate)) {
            return [HandRank.Straight, candidate as [CardProps, CardProps, CardProps, CardProps, CardProps]];
        }
    }

    if (trips.length > 0) {
        const trip = trips[trips.length - 1];
        const rem = handSort(cards.filter(x => !any(trip, c => !deepEqual(x, c)))).slice(0, 2);

        return [HandRank.Set, [...trip, ...rem] as [CardProps, CardProps, CardProps, CardProps, CardProps]];
    }

    if (pairs.length >= 2) {
        const [p1, p2] = [pairs.pop() as CardProps[], pairs.pop() as CardProps[]];
        const lastCard = handSort(cards.filter(x => !any(p1.concat(p2), c => !deepEqual(x, c))))[0];

        return [HandRank.TwoPair, [...p1, ...p2, lastCard] as [CardProps, CardProps, CardProps, CardProps, CardProps]];
    }

    if (pairs.length === 1) {
        const pair = pairs[0]
        const lastCards = handSort(cards.filter(x => !any(pair, c => !deepEqual(x, c)))).slice(0, 3);

        return [HandRank.Pair, [...pair, ...lastCards] as [CardProps, CardProps, CardProps, CardProps, CardProps]];
    }

    return [HandRank.HighCard, sorted.slice(0, 5) as [CardProps, CardProps, CardProps, CardProps, CardProps]];
}

export function compare(
    community: [CardProps, CardProps, CardProps, CardProps, CardProps],
    ...hands: [CardProps, CardProps][]): [number, [CardProps, CardProps, CardProps, CardProps, CardProps]] {

}