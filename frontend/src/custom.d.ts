/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '*.svg' {
    const content: any;
    export default content;
}

declare module '*.png' {
    const content: any;
    export default content;
}

declare module '*.jpg' {
    const content: any;
    export default content;
}

declare module '*.webp' {
    const content: any;
    export default content;
}

declare module 'unistore/preact' {
    import { AnyComponent, ComponentConstructor } from 'preact';
    import { ActionCreator, ActionFn, ActionMap, StateMapper } from 'unistore';

    type TupleTail<T extends any[], R> = T['length'] extends 0
        ? never
        : ((...tail: T) => R) extends (head: any, ...tail: infer I) => R
        ? I
        : never;

    type MakeBoundAction<K, A extends (...args: any) => Promise<Partial<K>> | Partial<K> | void> = (
        ...args: TupleTail<Parameters<A>, ReturnType<A>>
    ) => ReturnType<A>;

    type BoundActionFn<K, F extends ActionFn<K>> = MakeBoundAction<K, F>;

    export type ActionBinder<K, T extends ActionMap<K>> = {
        [P in keyof T]: BoundActionFn<K, T[P]>;
    };

    export function connect<T, S, K, I, A extends ActionMap<K>>(
        mapStateToProps: string | string[] | StateMapper<T, K, I>,
        actions: ActionCreator<K> | A,
    ): (
        Child: ComponentConstructor<T & I & ActionBinder<K, A>, S> | AnyComponent<T & I & ActionBinder<K, A>, S>,
    ) => ComponentConstructor<T | (T & I & ActionBinder<K, A>), S>;
}
