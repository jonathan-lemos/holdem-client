import {PlayerAction, TableActionType} from "./TableAction";
import React, {FormEvent, useState} from "react";
import {s} from "./Linq";
import BaseProps from "./BaseProps";
import {Hero, PlayerActionState} from "./Player";
import {round} from "./Misc";


export interface RaiseSliderProps {
    increments: number[];
    initialIndex?: number;
    onChange: (val: number) => void;
}

export function RaiseSlider({increments, onChange, initialIndex = 0, style, className}: RaiseSliderProps & BaseProps) {
    const handleInput = (e: FormEvent<HTMLInputElement>) => {
        const val = Number(e.currentTarget.value);
        onChange(increments[val]);
    };

    return <input className={`raise-slider ${className ?? ""}`} style={style} type="slider" min={0}
                  max={increments.length - 1} defaultValue={initialIndex}
                  onInput={handleInput}/>;
}

export interface PlayerControlsProps {
    bigBlind: number;
    onAction: (action: PlayerAction) => void;
    pot: number;
    prevBetSize?: number;
    stack: number;
    state: PlayerActionState;
    toCall: number;
}

export function PlayerControls({bigBlind, onAction, pot, prevBetSize, stack, state, toCall, style, className}: PlayerControlsProps & BaseProps) {
    const increments = s((function* () {
        let n = toCall + (prevBetSize ?? bigBlind);
        const incSize = (n: number) => Math.pow(10, Math.max(Math.floor(Math.log10(n)) - 1, 0));
        const round = (n: number) => Math.ceil(n * incSize(n)) / incSize(n);

        while (n < stack) {
            yield n;
            n += incSize(n);
            n = round(n);
        }
        yield stack;
    })()).toArray();

    let raiseValue = increments[0];

    let [mainClass, setMainClass] = useState("");
    let [raiseClass, setRaiseClass] = useState("behind invis");
    let [raising, setRaising] = useState(false);

    const changeState = (state: "raising" | "main") => {
        switch (state) {
            case "main":
                setMainClass("");
                setRaiseClass("behind invis");
                setRaising(false);
                break;
            case "raising":
                setMainClass("behind invis");
                setRaiseClass("");
                setRaising(true);
                break;
        }
    }

    return <div className="flex-col">
        <div className={`main-controls ${mainClass}`}>
            <div className="button-bar">
                <button className="fold-button" disabled={toCall === 0}
                        onClick={() => toCall > 0 && onAction({type: TableActionType.Fold})}>Fold
                </button>
                <button className="check-call-button"
                        onClick={() => onAction({type: toCall === 0 ? TableActionType.Check : TableActionType.Call})}>{toCall === 0 ? "Check" : `Call ${toCall}`}</button>
                <button className="raise-button" onClick={() => changeState("raising")}>Raise</button>
            </div>
        </div>
        <div className={`flex-col raise-controls ${raiseClass}`}>
            <div className="flex-row align-center">
                <RaiseSlider className="flex-grow-1 pr-l" increments={increments} onChange={v => raiseValue = v}/>
                <div className="pl-l flex-col">
                    <span className="nowrap">{raiseValue.toLocaleString()}</span>
                    <span className="nowrap">{round(100 * raiseValue / pot, 0.1)}% Pot</span>
                    <span className="nowrap">{round(raiseValue / bigBlind, 0.1)} BB</span>
                </div>
            </div>
            <div className="button-bar">
                <button className="raise-button" onClick={() => onAction({
                    type: TableActionType.Raise,
                    amountToCall: raiseValue - toCall,
                    totalBetSize: raiseValue,
                    allIn: raiseValue === stack
                })}>Raise to {raiseValue.toLocaleString()}</button>
                <button className="cancel-button" onClick={() => changeState("main")}>Cancel</button>
            </div>
        </div>
    </div>;
}

export interface PlayerHUDProps {
    bigBlind: number;
    displayName: string;
    onAction: (action: PlayerAction) => void;
    position: number;
    positionAbbr: string;
    positionString: string;
    pot: number;
    preflop: boolean;
    prevBetSize?: number;
    stack: number;
    state: PlayerActionState;
    toCall?: number;
}

export default function PlayerHUD({bigBlind, displayName, onAction, pot, preflop, position, positionAbbr, positionString, prevBetSize, stack, state, toCall = 0}: PlayerHUDProps) {
    return (
        <div className="flex-row">
            <Hero {...{bigBlind, position, positionAbbr, positionString, displayName, stack, state}} />
            <PlayerControls className="flex-grow-1" {...{bigBlind, pot, stack, state, toCall, onAction}} />

        </div>
    )
}