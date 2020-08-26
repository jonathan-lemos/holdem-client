import {PlayerAction, TableActionType} from "./TableAction";
import React, {FormEvent, useState} from "react";
import {s} from "./Linq";
import BaseProps from "./BaseProps";
import {Hero, PlayerActionState} from "./Player";
import {round} from "./Misc";
import {CardView, Rank, Suit} from "./Card";


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

    return <input className={`raise-slider ${className ?? ""}`} style={style} type="range" min={0}
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

    let [raiseValue, setRaiseValue] = useState(increments[0]);

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

    const raiseString = () => {
        if (raiseValue === stack) {
            return `All-in ${raiseValue.toLocaleString()}`;
        }
        if (toCall === 0) {
            return `Bet ${raiseValue.toLocaleString()}`;
        }
        return `Raise to ${raiseValue.toLocaleString()}`;
    }

    return <div className={`w-100 flex-col align-center ${className}`} style={style}>
        <div className={`fluid main-controls ${mainClass}`}>
            <div className="fluid button-bar">
                <button className="w-100 fold-button" disabled={toCall === 0}
                        onClick={() => toCall > 0 && onAction({type: TableActionType.Fold})}>Fold
                </button>
                <button className="w-100 check-call-button"
                        onClick={() => onAction({type: toCall === 0 ? TableActionType.Check : TableActionType.Call})}>{toCall === 0 ? "Check" : `Call ${toCall}`}</button>
                <button className="w-100 raise-button" onClick={() => changeState("raising")}>{toCall === 0 ? "Bet" : "Raise"}</button>
            </div>
        </div>
        <div className={`fluid flex-col raise-controls ${raiseClass}`}>
            <div className="fluid flex-row align-center p-m">
                <RaiseSlider className="w-100 flex-grow-1 mr-xs" increments={increments} onChange={setRaiseValue}/>
                <div className="pl-l flex-col">
                    <b className="size-125 nowrap">{raiseValue.toLocaleString()}</b>
                    <span className="h-0 invis nowrap size-125">{(round(stack * 10, 1)).toLocaleString()}</span>
                    {pot > 0 && <span className="nowrap">{round(100 * raiseValue / pot, 0.1).toFixed(1)}% Pot</span>}
                    <span className="nowrap">{round(raiseValue / bigBlind, 0.1).toFixed(1)} BB</span>
                    <span className="nowrap">{round(100 * raiseValue / stack, 0.1).toFixed(1)}% Stack</span>
                </div>
            </div>
            <div className="fluid button-bar p-m">
                <button className="w-100 raise-button" onClick={() => onAction({
                    type: TableActionType.Raise,
                    amountToCall: raiseValue - toCall,
                    totalBetSize: raiseValue,
                    allIn: raiseValue === stack
                })}>{raiseString()}</button>
                <button className="w-100 cancel-button" onClick={() => changeState("main")}>Cancel</button>
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

export default function PlayerHUD({bigBlind, displayName, onAction, pot, preflop, position, positionAbbr, positionString, prevBetSize, stack, state, toCall = 0, className, style}: PlayerHUDProps & BaseProps) {
    return (
        <div className={`w-100 flex-row ${className}`} style={style}>
            <Hero className="m-s" {...{bigBlind, position, positionAbbr, positionString, displayName, stack, state}} />
            <PlayerControls className="fluid flex-grow-1" {...{bigBlind, pot, stack, state, toCall, onAction}} />
            <CardView className="border round mx-s" maxLen={2} initialCards={[
                {rank: Rank.Jack, suit: Suit.Heart},
                {rank: Rank.Jack, suit: Suit.Diamond},
            ]} />
        </div>
    )
}