import { EventEmitter, IEventEmitter } from "../../shared/eventEmitter.js";
import { IEventEmittingObject } from "../../shared/eventEmittingObject.js";
import { Button, IButton } from "./button.js";

// todo: replace events with commands here to maintain single direction view to viewmodel references (viewmodel should have events, view should have direct calls to viewmodel)

export interface IActionButton extends IButton, IEventEmittingObject<'pressed', IActionButton> {

}

export class ActionButton extends Button implements IActionButton {
    private _pressedEventEmitter: IEventEmitter<this>;

    public constructor(innerElement: HTMLDivElement)
    {
        super(innerElement);

        this._pressedEventEmitter = new EventEmitter<this>();
    }

    public addEventListener(eventName: "pressed", eventHandler: (invoker: this) => void): void {
        this._pressedEventEmitter.addEventListener(eventHandler);
    }

    public removeEventListener(eventName: "pressed", eventHandler: (invoker: this) => void): void {
        this._pressedEventEmitter.removeEventListener(eventHandler);
    }

    /**
     * The method to handle a DOM click event. Calls the stored action.
     */
    protected _handlePress(): void {
        this._pressedEventEmitter.invokeEvent(this);
    }
}