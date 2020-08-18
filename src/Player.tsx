import React from "react";
import Card from "./Card";

export enum PlayerActionState {
    InHandActing,
    InHandWaiting,
    Folded,
}

export interface PlayerProps {
    displayName: string,
    position: number,
    positionAbbr: string,
    positionString: string,
    stack: number,
    state: PlayerActionState
}

export function Villain({displayName, position, positionAbbr, positionString, stack, state}: PlayerProps) {
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
        <div className={`villain-box p-l ${stateClass}`}>
            <b className="mb-xl nowrap size-200">{displayName}</b>
            <div className="flex-row justify-space-between">
                <span className="flex-grow-1 mr-xl nowrap">{stack.toLocaleString()}</span>
                <b><abbr className="nowrap" title={positionString}>{positionAbbr}</abbr></b>
            </div>
        </div>
    )
}

export function Hero({displayName, position, positionAbbr, positionString, stack, state}: PlayerProps) {
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
        <div className="flex-row">
            <div className={`hero-box p-l ${stateClass}`}>
                <b className="mb-xl nowrap size-200">{displayName}</b>
                <div className="flex-row justify-space-between">
                    <span className="flex-grow-1 mr-xl nowrap">{stack.toLocaleString()}</span>
                    <b><abbr className="nowrap" title={positionString}>{positionAbbr}</abbr></b>
                </div>
            </div>
            <div>
                <Card rank={} suit={}
            </div>
        </div>
    )
}
