import BaseProps from "./BaseProps";
import React, {useState} from "react";

export interface SelectedAnimationProps {
    delayMs?: number;
    durationMs?: number;
    beforeStart?: () => void | Promise<void>;
    onCompletion?: () => void | Promise<void>;
}

export type AnimateProps = SelectedAnimationProps & {
    type: "expand-in" | "flip-in" | "flip-out" | "none";
}

export const delay = (ms: number): Promise<void> => new Promise<void>(resolve => {
    setTimeout(resolve, ms);
});

export const animateStyleDefaults = Object.freeze({
    animationName: "",
    animationDuration: "0",
    animationTimingFunction: "ease",
    animationDelay: "0",
    animationFillMode: "forwards"
});

export async function animate<T extends {}>(style: T,
                                            setStyle: React.Dispatch<React.SetStateAction<T>>,
                                            animations: AnimateProps | AnimateProps[]): Promise<void> {
    if (!Array.isArray(animations)) {
        animations = [animations];
    }

    for (const anim of animations) {
        anim.beforeStart && await anim.beforeStart();

        if ((anim.delayMs ?? 0) > 0) {
            await delay(anim.delayMs!);
        }

        if (anim.type === "none") {
            continue;
        }

        setStyle({
            ...style,
            animationName: anim.type,
            animationDelay: `${anim.delayMs ?? 0}ms`,
            animationDuration: `${anim.durationMs ?? 0}ms`
        });

        anim.onCompletion && await anim.onCompletion();
    }

    setStyle({
        ...style,
        animationName: null
    });
}

export default function Animated(props: React.PropsWithChildren<(AnimateProps | { animations: AnimateProps[] }) & BaseProps>) {
    const [style, setStyle] = useState(Object.assign({...props.style ?? {}}, animateStyleDefaults));

    if (("animations" in props && props.animations.length === 0) || ("type" in props && props.type === "none")) {
        return <>{props.children}</>;
    }

    const anims = "animations" in props ? props.animations : [props];

    animate(style, setStyle, anims).then(r => {});

    return <div className={`wrap ${props.className ?? ""}`} style={style}>
        {props.children}
    </div>
}