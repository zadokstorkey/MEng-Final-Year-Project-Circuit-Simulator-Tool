import { ForcedStringLiteral } from "./forceStringLiteral.js";

/**
 * Interface for objects which emit events.
 */
export interface IEventEmittingObject<TEventName extends string & ForcedStringLiteral<TEventName>, TInvoker, TEventHandler extends (invoker: TInvoker, ...args: any[]) => void = (invoker: TInvoker) => void> {
    addEventListener(eventName: TEventName, eventHandler: TEventHandler): void;
    removeEventListener(eventName: TEventName, eventHandler: TEventHandler): void;
}