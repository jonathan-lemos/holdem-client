import React from "react";
import Card from "./Card";
import BaseProps from "./BaseProps";
import {round} from "./Misc";

export enum PlayerActionState {
    InHandActing,
    InHandWaiting,
    Folded,
}

export interface PlayerProps {
    displayName: string;
    position: number;
    positionAbbr: string;
    positionString: string;
    stack: number;
    state: PlayerActionState;
}

export interface PlayerTableProps {
    bigBlind: number;
}

export function Villain({bigBlind, displayName, position, positionAbbr, positionString, stack, state, className, style}: PlayerProps & PlayerTableProps & BaseProps) {
    let stateClass = "";
    switch (state) {
        case PlayerActionState.Folded:
            stateClass = "folded";
            break;
        case PlayerActionState.InHandActing:
            stateClass = "acting";
            break;
        case PlayerActionState.InHandWaiting:
            stateClass = "waiting";
            break;
    }

    return (
        <div className={`villain-box p-l ${stateClass} ${className ?? ""}`} style={style}>
            <div className="flex-row justify-space-between m-l">
                <b className="nowrap size-200 mr-s">{displayName}</b>
                <div className="flex-grow-1" />
                <abbr className="ml-s position-label" title={positionString}>{positionAbbr}</abbr>
            </div>
            <span className="m-l nowrap">{stack.toLocaleString()}</span>
            <span className="m-l nowrap">{round(stack / bigBlind, 0.1).toLocaleString()} BB</span>
        </div>
    )
}

export function Hero({bigBlind, displayName, position, positionAbbr, positionString, stack, state, style, className}: PlayerProps & PlayerTableProps & BaseProps) {
    let stateClass = "";
    switch (state) {
        case PlayerActionState.Folded:
            stateClass = "folded";
            break;
        case PlayerActionState.InHandActing:
            stateClass = "acting";
            break;
        case PlayerActionState.InHandWaiting:
            stateClass = "waiting";
            break;
    }

    return (
        <div className={`hero-box p-l ${stateClass} ${className ?? ""}`} style={style}>
            <div className="flex-row justify-space-between m-l">
                <b className="nowrap size-200 mr-s">{displayName}</b>
                <div className="flex-grow-1" />
                <abbr className="ml-s position-label" title={positionString}>{positionAbbr}</abbr>
            </div>
            <span className="m-l nowrap">{stack.toLocaleString()}</span>
            <span className="m-l nowrap">{round(stack / bigBlind, 0.1).toLocaleString()} BB</span>
        </div>
    )
}
