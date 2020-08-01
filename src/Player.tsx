import React from "react";

export enum PlayerActionState {
    InHandActing,
    InHandWaiting,
    Folded,
}

export interface PlayerProps {
    chair: Number,
    displayName: string,
}

export interface PlayerState {
    position: Number,
    stack: Number,
    state: PlayerActionState
}

export default class Player extends React.Component<PlayerProps, PlayerState> {
}