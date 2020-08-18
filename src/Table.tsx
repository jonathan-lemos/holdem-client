import React from 'react';
import Player, {PlayerActionState, PlayerProps} from "./Player";
import {Blinds} from "./Blinds";
import PlayerHUD from "./PlayerHUD";


export interface TableProps {
    maxChairs: number,
}

export interface TableState {
    blinds: Blinds,
    opponents: PlayerProps[],
    player: PlayerProps
    pot: number,
}

export class Table extends React.Component<TableProps, TableState> {
    public constructor(props: TableProps) {
        super(props);
        this.state = {blinds: {ante: 0, bigBlind: 100, smallBlind: 50}, opponents: [{displayName: "ultrachad69", position: 1, positionString: "BB", stack: 10000, state: PlayerActionState.InHandWaiting}], player: {displayName: "pussydestroyer69", position: 0, positionString: "SB", stack: 10000, state: PlayerActionState.InHandActing}, pot: 0};
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

        const mapPlayer = (player: PlayerProps) => <Player {...player} key={player.displayName} />;

        return (<div className="flex-col align-center">
            {/* players on top */}
            <div className="flex-row align-center justify-space-between my-2 px-4">
                {midList.map(mapPlayer)}
            </div>
            {/* middle section */}
            <div className="flex-grow-1 flex-row align-center">
                {/* players on left */}
                <div className="flex-col reverse align-center">
                    {leftList.map(mapPlayer)}
                </div>
                {/* cards + pot */}
                <div className="flex-grow-1">

                </div>
                {/* players on right */}
                <div className="flex-col align-center">
                    {rightList.map(mapPlayer)}
                </div>
            </div>
            {/* current player controls */}
            <PlayerHUD bigBlind={this.state.blinds.bigBlind} onAction={() => {}} pot={this.state.pot} preflop={true} stack={10000} />
        </div>);
    }
}