import { EventEmitter, IEventEmitter } from "./eventEmitter.js";
import { IEventEmittingObject } from "./eventEmittingObject.js";

/**
 * Interface for things which throw events on updating. Mostly used for ViewModel classes.
 */
export interface INotifyOnUpdate extends IEventEmittingObject<'updated', INotifyOnUpdate> {

}

/**
 * Abstrace class for things which throw events on updating. Mostly used for ViewModel classes.
 */
export abstract class NotifyOnUpdate implements INotifyOnUpdate {
    private _updatedEventEmitter: IEventEmitter<this>;

    public constructor() {
        this._updatedEventEmitter = new EventEmitter<this>();
    }

    public addEventListener(eventName: 'updated', eventHandler: (invoker: this) => void): void {
        this._updatedEventEmitter.addEventListener(eventHandler);
    }

    public removeEventListener(eventName: 'updated', eventHandler: (invoker: this) => void): void {
        this._updatedEventEmitter.removeEventListener(eventHandler);
    }

    protected _invokeUpdated(): void {
        this._updatedEventEmitter.invokeEvent(this);
    }
}