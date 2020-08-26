import React from 'react';
import {PlayerActionState, PlayerProps, Villain} from "./Player";
import {Blinds} from "./Blinds";
import PlayerHUD from "./PlayerHUD";
import {CardView, Rank, Suit} from "./Card";
import {round} from "./Misc";
import BaseProps from "./BaseProps";


export interface TableProps {
    maxChairs: number,
}

export interface TableState {
    blinds: Blinds,
    opponents: PlayerProps[],
    player: PlayerProps
    pot: number,
}

export class Table extends React.Component<TableProps & BaseProps, TableState> {
    private cards: React.RefObject<CardView>;

    public constructor(props: TableProps) {
        super(props);

        this.state = {
            blinds: {ante: 0, bigBlind: 100, smallBlind: 50},
            opponents: [{
                displayName: "ultrachad69",
                position: 1,
                positionAbbr: "BB",
                positionString: "Big Blind",
                stack: 10000,
                state: PlayerActionState.InHandWaiting
            }],
            player: {
                displayName: "pussydestroyer69",
                position: 0,
                positionAbbr: "SB",
                positionString: "",
                stack: 10000,
                state: PlayerActionState.InHandActing
            },
            pot: 0
        };

        this.cards = React.createRef<CardView>();
    }

    public render() {
        let sideCount = Math.ceil(this.state.opponents.length * window.screen.availHeight / (window.screen.availWidth + window.screen.availHeight) / 4);
        let topCount = this.state.opponents.length - (sideCount * 2);
        if (topCount <= 0) {
            topCount = this.state.opponents.length % 2 !== 0 ? 1 : 2;
            sideCount = (this.state.opponents.length - topCount) / 2;
        }

        const leftList: PlayerProps[] = [];
        const midList: PlayerProps[] = [];
        const rightList: PlayerProps[] = [];

        for (let i = 0; i < sideCount; ++i) {
            leftList.push(this.state.opponents[i]);
        }
        for (let i = sideCount; i < sideCount + topCount; ++i) {
            midList.push(this.state.opponents[i]);
        }
        for (let i = sideCount + topCount; i < this.state.opponents.length; ++i) {
            rightList.push(this.state.opponents[i]);
        }

        const mapPlayer = (player: PlayerProps) => <Villain {...player} bigBlind={this.state.blinds.bigBlind} key={player.displayName}/>;

        return (<div className={`fluid flex-col align-center p-m ${this.props.className}`} style={this.props.style}>
            {/* players on top */}
            <div className="w-100 flex-row align-center justify-space-between">
                {midList.map(mapPlayer)}
            </div>
            {/* middle section */}
            <div className="fluid flex-grow-1 flex-row align-center m-s">
                {/* players on left */}
                <div className="h-100 flex-col reverse align-center">
                    {leftList.map(mapPlayer)}
                </div>
                {/* cards + pot */}
                <div className="fluid flex-grow-1 flex-col align-center justify-center">
                    <CardView className="fluid bg-green p-s" maxLen={5} ref={this.cards} initialCards={[
                        {rank: Rank.Ace, suit: Suit.Spade},
                        {rank: Rank.Five, suit: Suit.Heart},
                        {rank: Rank.Jack, suit: Suit.Spade},
                    ]} />
                    <div className="flex-col text-center border round py-m px-xl mt-m">
                        <span className="nowrap">Pot: {this.state.pot}</span>
                        <span className="nowrap">{round(this.state.pot / this.state.blinds.bigBlind, 0.1)} BB</span>

                        <span className="nowrap mt-m">{this.state.blinds.smallBlind} / {this.state.blinds.bigBlind}</span>
                    </div>
                </div>
                {/* players on right */}
                <div className="h-100 flex-col align-center">
                    {rightList.map(mapPlayer)}
                </div>
            </div>
            {/* current player controls */}
            <PlayerHUD className="mt-s"
                bigBlind={this.state.blinds.bigBlind} onAction={() => {
            }} pot={this.state.pot} preflop={true} stack={10000} displayName="pussyslayer69" position={0}
                       positionAbbr="SB" positionString="Small Blind" state={PlayerActionState.InHandActing}
                       toCall={0}/>
        </div>);
    }
}