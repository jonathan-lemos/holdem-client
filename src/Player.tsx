import React from "react";

export enum PlayerActionState {
    InHandActing,
    InHandWaiting,
    Folded,
}

export interface PlayerProps {
    displayName: string,
    position: number,
    positionString: string,
    stack: number,
    state: PlayerActionState
}

export default function Player({displayName, position, positionString, stack, state}: PlayerProps) {
    let stateClass = "";
    switch (state) {
        case PlayerActionState.Folded:
            stateClass = "pas-folded";
            break;
        case PlayerActionState.InHandActing:
            stateClass = "pas-action";
            break;
        case PlayerActionState.InHandWaiting:
            stateClass = "pas-waiting";
            break;
    }

    return (
        <div className={`${stateClass} w-100 h-100 border d-flex flex-column align-items-center`}>
            <b>{displayName}</b>
            <i>{positionString}</i>
            <span>{stack}</span>
        </div>
    )
}
