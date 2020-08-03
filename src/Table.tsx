import React from 'react';
import Player from "./Player";


export interface TableProps {
    maxChairs: number,
}

export interface TableState {
    ante: Number,
    bigBlind: Number,
    players: Player[],
    pot: Number,
    smallBlind: Number
}

export class Table extends React.Component<TableProps, TableState> {
    public render() {
        let sideCount = Math.ceil(this.state.players.length * window.screen.availHeight / (window.screen.availWidth + window.screen.availHeight) / 4);
        let topCount = this.state.players.length - (sideCount * 2);
        if (topCount <= 0) {
            topCount = this.state.players.length % 2 !== 0 ? 1 : 2;
            sideCount = (this.state.players.length - topCount) / 2;
        }

        const leftList: Player[] = [];
        const midList: Player[] = [];
        const rightList: Player[] = [];

        for (let i = sideCount - 1; i > 0; --i) {
            leftList.push(this.state.players[i]);
        }
        for (let i = sideCount; i < sideCount + topCount; ++i) {
            midList.push(this.state.players[i]);
        }
        for (let i = sideCount + topCount; i < this.state.players.length; ++i) {
            rightList.push(this.state.players[i]);
        }

        x = <Player props={}

        return (<div className="w-100 d-flex flex-column">
            {/* players on top */}
            <div className="w-100 d-flex justify-content-center">
                {midList}
            </div>
            {/* middle section */}
            <div className="h-100 w-100 d-flex flex-grow-1">
                {/* players on left */}
                <div className="w-100 d-flex flex-column">
                    {leftList}
                </div>
                {/* cards + pot */}
                <div className="w-100 flex-grow-1">

                </div>
                {/* players on right */}
                <div className="w-100 d-flex flex-column">
                    {rightList}
                </div>
            </div>
            {/* current player controls */}
            <div className="w-100 d-flex">
            </div>
        </div>);
    }
}