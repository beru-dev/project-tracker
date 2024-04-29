"use client"

import { useState } from "react";

type EnumLike = string | number

type StateMachine<S extends EnumLike, T extends EnumLike> = ({ [state in S]: { [transition in T]?: S } });

export const useStateMachine = <S extends EnumLike, T extends EnumLike>(
    machine: StateMachine<S, T>,
    initialState: S
): [S, (transition: T) => void] => {
    const [currentState, setState] = useState<S>(initialState);

    const applyTransition = (transition: T) => {
        const newState = machine[currentState][transition];

        if(newState === undefined) {
            console.log(`${transition} is not a valid transition while in ${currentState}`);
            return
        }

        setState(newState);
    }

    return [currentState, applyTransition];
}