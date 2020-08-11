import {PlayerAction, TableActionType} from "./TableAction";
import React, {FormEvent, useState} from "react";
import Transition, {FromType} from "./Transition";
import { s } from "./Linq";

export interface RaiseSliderProps {
    increments: number[];
    initialIndex?: number;
    onChange: (val: number) => void;
}

export function RaiseSlider({increments, onChange, initialIndex = 0}: RaiseSliderProps) {
    const handleInput = (e: FormEvent<HTMLInputElement>) => {
        const val = Number(e.currentTarget.value);
        onChange(increments[val]);
    };

    return <input className="w-100 raise-slider" type="slider" min={0} max={increments.length - 1} value={initialIndex}
                  onInput={handleInput}/>;
}

export interface PlayerControlsProps {
    bigBlind: number;
    onAction: (action: PlayerAction) => void;
    pot: number;
    preflop: boolean;
    prevBetSize?: number;
    stack: number;
    toCall?: number;
}

export default function PlayerControls({bigBlind, onAction, pot, preflop, prevBetSize, stack, toCall = 0}: PlayerControlsProps) {
    const [isRaising, setIsRaising] = useState(false);
    const [hasRaised, setHasRaised] = useState(false);

    let raiseValue = 0;

    const increments = s((function* () {
        let n = prevBetSize ?? 0;
        const incSize = (n: number) => Math.pow(10, Math.max(Math.floor(Math.log10(n)) - 1, 0));
        const round = (n: number) => Math.ceil(n * incSize(n)) / incSize(n);

        while (n < stack) {
            yield n;
            n += incSize(n);
            n = round(n);
        }
        yield stack;
    })()).toArray();

    return (
        <div className="w-100 h-100 d-flex flex-column player-controls">
            <Transition expanding={isRaising} from={FromType.Bottom}>
                <div className={`position-relative w-100 ${hasRaised ? "" : "hidden"}`}>
                    <div className="position-absolute d-flex flex-column raise-controls">
                        <RaiseSlider increments={increments} onChange={v => raiseValue = v}/>
                        <div className="w-100 d-flex">
                            <div className="w-100 h-100 flex-grow-1 raise-controls-data">

                            </div>
                            <div className="h-100 raise-controls-confirm-button" onClick={() => onAction({
                                allIn: raiseValue === stack,
                                amountToCall: raiseValue - (toCall ?? 0),
                                totalBetSize: raiseValue,
                                type: TableActionType.Raise
                            })}>
                                Confirm
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
            <div className="w-100 d-flex player-controls-button-bar">
                <div
                    className={`w-100 flex-grow-1 mx-4 player-controls-button fold-button ${toCall ? "" : "player-controls-button-disabled"}`}
                    onClick={() => onAction({type: TableActionType.Fold})}>Fold
                </div>
                <div className="w-100 flex-grow-1 mx-4 call-button"
                     onClick={() => onAction({type: toCall ? TableActionType.Call : TableActionType.Check})}>{toCall ? `Call ${toCall}` : "Check"}</div>
                <div className="w-100 flex-grow-1 mx-4 call-button" onClick={() => {
                    setIsRaising(!isRaising);
                    setHasRaised(true);
                }}>{toCall ? "Raise" : "Bet"}</div>
            </div>
        </div>
    )
}