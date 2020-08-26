import React from "react";
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
            stateClass = "acting border-glow";
            break;
        case PlayerActionState.InHandWaiting:
            stateClass = "waiting";
            break;
    }

    return (
        <div className={`villain-box ${stateClass} ${className ?? ""}`} style={style}>
            <div className="flex-row justify-space-between align-center m-s">
                <b className="nowrap size-125 mr-s flex-grow-1 text-center">{displayName}</b>
                <abbr className="ml-s position-label" title={positionString}><b>{positionAbbr}</b></abbr>
            </div>
            <span className="m-s nowrap">{stack.toLocaleString()} / {round(stack / bigBlind, 0.1).toLocaleString()} BB</span>
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
            stateClass = "acting border-glow";
            break;
        case PlayerActionState.InHandWaiting:
            stateClass = "waiting";
            break;
    }

    return (
        <div className={`hero-box ${stateClass} ${className ?? ""}`} style={style}>
            <div className="flex-row justify-space-between align-center m-s">
                <b className="nowrap size-150 mr-s flex-grow-1 text-center">{displayName}</b>
                <abbr className="ml-s position-label size-125" title={positionString}><b>{positionAbbr}</b></abbr>
            </div>
            <span className="m-s nowrap size-125">{stack.toLocaleString()} / {round(stack / bigBlind, 0.1).toLocaleString()} BB</span>
        </div>
    )
}
