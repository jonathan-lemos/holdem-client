import {range, s, valueMap} from "./Linq";
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
    if (cards.length < 2) {
        return true;
    }

    let prev = RankToOrder[cards[0].rank];

    for (let i = 1; i < cards.length - 1; ++i) {
        let cur = RankToOrder[cards[i].rank];
        if (cur !== prev - 1) {
            return false;
        }
        prev = cur;
    }

    if (cards[0].rank === Rank.Five && cards[cards.length - 1].rank === Rank.Ace) {
        return true;
    }

    return RankToOrder[cards[cards.length - 1].rank] === prev - 1;
}

export const bestFive = (cards: CardProps[]): { rank: HandRank, hand: [CardProps, CardProps, CardProps, CardProps, CardProps] } => {
    const suits = valueMap(s(cards).groupBy(c => c.suit), handSort);
    const ranks = valueMap(s(cards).groupBy(c => c.rank), handSort);

    const maxSuit = Object.keys(suits).reduce((a, c) => a.length >= suits[c].length ? a : suits[c], [] as CardProps[]);
    const maxRank = Object.keys(ranks).reduce((a, c) => a.length >= ranks[c].length ? a : ranks[c], [] as CardProps[]);

    if (maxSuit.length >= 5) {
        let res = range(maxSuit.length - 5).map(n => maxSuit.slice(n, n + 5)).firstOrUndefined(isStraight);
        if (res !== undefined) {
            if (res[0].rank === Rank.Two && res[res.length - 1].rank === Rank.Ace) {
                res = [res[res.length - 1], ...res.slice(0, -1)]
            }
            return {rank: HandRank.StraightFlush, hand: res as [CardProps, CardProps, CardProps, CardProps, CardProps]};
        }
    }

    if (maxRank.length === 4) {
        const lastCard = handSort(cards.filter(card => s(maxRank).none(mcard => deepEqual(mcard, card))))[0];
        return {
            rank: HandRank.Quads,
            hand: [...maxRank, lastCard] as [CardProps, CardProps, CardProps, CardProps, CardProps]
        };
    }

    const trips = Object.keys(ranks).map(k => ranks[k]).filter(a => a.length === 3).sort((a, b) => RankToOrder[a[0].rank] - RankToOrder[b[0].rank]);
    const pairs = Object.keys(ranks).map(k => ranks[k]).filter(a => a.length === 2).sort((a, b) => RankToOrder[a[0].rank] - RankToOrder[b[0].rank]);

    if (trips.length > 0 && trips.length + pairs.length >= 2) {
        const trip = trips.pop() as CardProps[];
        const pair = trips.concat(pairs).reduce((a, c) => RankToOrder[a[0].rank] >= RankToOrder[c[0].rank] ? a : c).slice(0, 2);

        return {
            rank: HandRank.Boat,
            hand: trip.concat(pair) as [CardProps, CardProps, CardProps, CardProps, CardProps]
        };
    }

    if (s(Object.values(suits)).any(suit => suit.length >= 5)) {
        const candidates = Object.values(suits).filter(suit => suit.length >= 5).map(handSort);
        const candTmp = candidates.map(x => [...x]);
        while (candTmp[0].length > 0) {
            let maxRanks = s(candTmp.map(x => x[0])).argMax(x => RankToOrder[x.rank]);
            if (maxRanks.length === 1) {
                return {
                    rank: HandRank.Flush,
                    hand: s(candidates).first(c => c[0].suit === maxRanks[0].suit).slice(0, 5) as [CardProps, CardProps, CardProps, CardProps, CardProps]
                };
            }
        }
        return {
            rank: HandRank.Flush,
            hand: candidates.sort((a, b) => SuitToOrder[a[0].suit] - SuitToOrder[b[0].suit])[0] as [CardProps, CardProps, CardProps, CardProps, CardProps]
        };
    }

    const sortedDistinct = s(handSort(cards)).distinct((c1, c2) => c1.rank === c2.rank).toArray();
    let straightCandidates = range(sortedDistinct.length - 4)
        .map(i => sortedDistinct.slice(i, i + 5));

    if (sortedDistinct[0].rank === Rank.Ace) {
        const twoElem = s(sortedDistinct).enumerate().firstOrUndefined(e => e.elem.rank === Rank.Two);
        if (twoElem !== undefined && twoElem.index >= 5) {
            straightCandidates = straightCandidates.concat([[...sortedDistinct.slice(twoElem.index - 3, twoElem.index + 1), sortedDistinct[0]]]);
        }
    }

    const straightCandidate = straightCandidates.firstOrUndefined(isStraight);
    if (straightCandidate !== undefined) {
        return {rank: HandRank.Straight, hand: straightCandidate as [CardProps, CardProps, CardProps, CardProps, CardProps]};
    }

    if (trips.length > 0) {
        const trip = trips[trips.length - 1];
        const rem = handSort(cards.filter(card => s(trip).none(mcard => deepEqual(card, mcard)))).slice(0, 2);

        return {rank: HandRank.Set, hand: [...trip, ...rem] as [CardProps, CardProps, CardProps, CardProps, CardProps]};
    }

    if (pairs.length >= 2) {
        const [p1, p2] = [pairs.pop() as CardProps[], pairs.pop() as CardProps[]];
        const lastCard = handSort(cards.filter(card => s(p1.concat(p2)).none(mcard => deepEqual(card, mcard))))[0];

        return {
            rank: HandRank.TwoPair,
            hand: [...p1, ...p2, lastCard] as [CardProps, CardProps, CardProps, CardProps, CardProps]
        };
    }

    if (pairs.length === 1) {
        const pair = pairs[0]
        const lastCards = handSort(cards.filter(card => s(pair).none(mcard => deepEqual(card, mcard)))).slice(0, 3);

        return {
            rank: HandRank.Pair,
            hand: [...pair, ...lastCards] as [CardProps, CardProps, CardProps, CardProps, CardProps]
        };
    }

    return {
        rank: HandRank.HighCard,
        hand: handSort(cards).slice(0, 5) as [CardProps, CardProps, CardProps, CardProps, CardProps]
    };
}

export function getWinners(
    community: CardProps[],
    hands: [CardProps, CardProps][]): { winner: [CardProps, CardProps], hand: [CardProps, CardProps, CardProps, CardProps, CardProps], rank: HandRank }[] {

    if (community.length !== 5) {
        throw new Error("Community card length must be 5");
    }

    const bestHands = s(hands).map(h => bestFive([...community, ...h])).enumerate();

    let candidates = s(bestHands).argMax(hand => hand.elem.rank);
    for (let i = 0; i < 5; ++i) {
        if (candidates.length === 1) {
            break;
        }
        candidates = s(candidates).argMax(cand => RankToOrder[cand.elem.hand[i].rank]);
    }

    return candidates.map(x => ({winner: hands[x.index], hand: x.elem.hand, rank: x.elem.rank}));
}