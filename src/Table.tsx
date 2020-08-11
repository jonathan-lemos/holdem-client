import React from 'react';
import Player, {PlayerProps} from "./Player";
import {Blinds} from "./Blinds";


export interface TableProps {
    maxChairs: number,
}

export interface TableState {
    blinds: Blinds,
    players: PlayerProps[],
    pot: Number,
}

export class Table extends React.Component<TableProps, TableState> {
    public render() {
        let sideCount = Math.ceil(this.state.players.length * window.screen.availHeight / (window.screen.availWidth + window.screen.availHeight) / 4);
        let topCount = this.state.players.length - (sideCount * 2);
        if (topCount <= 0) {
            topCount = this.state.players.length % 2 !== 0 ? 1 : 2;
            sideCount = (this.state.players.length - topCount) / 2;
        }

        const leftList: PlayerProps[] = [];
        const midList: PlayerProps[] = [];
        const rightList: PlayerProps[] = [];

        for (let i = sideCount - 1; i > 0; --i) {
            leftList.push(this.state.players[i]);
        }
        for (let i = sideCount; i < sideCount + topCount; ++i) {
            midList.push(this.state.players[i]);
        }
        for (let i = sideCount + topCount; i < this.state.players.length; ++i) {
            rightList.push(this.state.players[i]);
        }

        const mapPlayer = (player: PlayerProps) => <Player {...player} key={player.displayName} />;

        return (<div className="w-100 d-flex flex-column">
            {/* players on top */}
            <div className="w-100 d-flex justify-content-center">
                {midList.map(mapPlayer)}
            </div>
            {/* middle section */}
            <div className="h-100 w-100 d-flex flex-grow-1">
                {/* players on left */}
                <div className="w-100 d-flex flex-column">
                    {leftList.map(mapPlayer)}
                </div>
                {/* cards + pot */}
                <div className="w-100 flex-grow-1">

                </div>
                {/* players on right */}
                <div className="w-100 d-flex flex-column">
                    {rightList.map(mapPlayer)}
                </div>
            </div>
            {/* current player controls */}
            <div className="w-100 d-flex">
            </div>
        </div>);
    }
}