import { EventEmitter, IEventEmitter } from "../../shared/eventEmitter.js";
import { IEventEmittingObject } from "../../shared/eventEmittingObject.js";
import { Button, IButton } from "./button.js";

// todo: replace events with commands here to maintain single direction view to viewmodel references (viewmodel should have events, view should have direct calls to viewmodel)

export interface IToggleButton extends IButton, IEventEmittingObject<'toggled', IToggleButton> {

}

export class ToggleButton extends Button implements IToggleButton {
    private _toggledEventEmitter: IEventEmitter<this, (invoker: this, toggled: boolean) => void>;

    /**
     * The name of the css variable which tracks whether the button is toggled.
     */
    private _cssToggledVariableName: string;

    public constructor(innerElement: HTMLDivElement, cssToggledVariableName: string) {
        super(innerElement);

        this._toggledEventEmitter = new EventEmitter<this, (invoker: this, toggled: boolean) => void>();
        this._cssToggledVariableName = cssToggledVariableName;
    }

    public addEventListener(eventName: "toggled", eventHandler: (invoker: this, toggled: boolean) => void): void {
        this._toggledEventEmitter.addEventListener(eventHandler);
    }

    public removeEventListener(eventName: "toggled", eventHandler: (invoker: this, toggled: boolean) => void): void {
        this._toggledEventEmitter.removeEventListener(eventHandler);
    }

    /**
     * The method to handle a DOM click event. Modifies the css property to track whether the button is pressed and then calls the on-toggle function.
     */
    protected _handlePress(): void {
        let style = getComputedStyle(this.innerElement);
        let toggled = style.getPropertyValue(this._cssToggledVariableName) == "1";
        toggled = !toggled;
        style.setProperty(this._cssToggledVariableName, toggled ? "1" : "0");
        this._toggledEventEmitter.invokeEvent(this, toggled);
    }
}