export enum TableActionType {
    Fold,
    Check,
    Call,
    Raise
}

export interface FoldAction {
    type: TableActionType.Fold;
}

export interface CheckAction {
    type: TableActionType.Check;
}

export interface CallAction {
    type: TableActionType.Call;
}

export interface RaiseAction {
    type: TableActionType.Raise;
    amountToCall: number;
    totalBetSize: number;
    allIn: boolean;
}

export type PlayerAction = FoldAction | CheckAction | CallAction | RaiseAction;

export interface PlayerInfo {
    displayName: string;
    position: number;
}

export type TableAction = PlayerAction & PlayerInfo;
