import React from "react";

export enum TransitionType {
    ExpandY
}

export enum FromType {
    Bottom,
    Top
}

export interface TransitionProps {
    type: TransitionType;
    from: FromType;
    lenMs: number;
    expanding: boolean;
}

export default class Transition extends React.Component<TransitionProps> {
    public static defaultProps: TransitionProps = {
        type: TransitionType.ExpandY,
        from: FromType.Top,
        lenMs: 200,
        expanding: true,
    }

    public constructor(props: TransitionProps) {
        super(props);
    }

    public render() {
        let transformOrigin: string;
        switch (this.props.from) {
            case FromType.Top:
                transformOrigin = "top center";
                break;
            case FromType.Bottom:
                transformOrigin = "bottom center";
                break;
        }

        let animationName: string;
        switch (this.props.type) {
            case TransitionType.ExpandY:
                animationName = "anim-expand-y";
        }
        const animationStyle = `${animationName} ${this.props.lenMs}ms ease;`;

        return (
            <div style={{"transformOrigin": transformOrigin, "animation": animationStyle}}>
                {this.props.children}
            </div>
        );
    }
}

