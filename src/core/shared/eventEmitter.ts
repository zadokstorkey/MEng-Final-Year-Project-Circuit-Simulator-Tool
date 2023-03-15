import { IEventEmittingObject } from "./eventEmittingObject.js";
import { ForcedStringLiteral } from "./forceStringLiteral.js";

export interface IEventEmitter<TInvoker, TEventHandler extends (invoker: TInvoker, ...args: any[]) => void = (invoker: TInvoker) => void> {
    addEventListener(eventHandler: TEventHandler): void;
    removeEventListener(eventHandler: TEventHandler): void;
    invokeEvent(...params: Parameters<TEventHandler>): void;
}

export class EventEmitter<TInvoker, TEventHandler extends (invoker: TInvoker, ...args: any[]) => void = (invoker: TInvoker) => void> implements IEventEmitter<TInvoker, TEventHandler> {
    private _eventHandlers: (TEventHandler)[] = [];

    public constructor() {
        
    }

    public addEventListener(eventHandler: TEventHandler): void {
        this._eventHandlers.push(eventHandler);
    }

    public removeEventListener(eventHandler: TEventHandler): void {
        let index = this._eventHandlers.indexOf(eventHandler);
        if (index === -1) {
            throw new Error('Attempt to remove event-handler that does not exist.');
        }
        this._eventHandlers.splice(index, 1);
    }
    
    public invokeEvent(...params: Parameters<TEventHandler>): void {
        this._eventHandlers.forEach((eventHandler: ((...args: any[]) => void)) => eventHandler(...params));
    }
}