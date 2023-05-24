import { Button, IButton } from "./button.js";

/**
 * Interface for a button which calls a provided command when pressed.
 */
export interface IActionButton extends IButton {

}

/**
 * Class for a button which calls a provided command when pressed.
 */
export class ActionButton extends Button implements IActionButton {
    private _onPressCommand: () => void;

    public constructor(innerElement: HTMLDivElement, onPressCommand: () => void) {
        super(innerElement);

        this._onPressCommand = onPressCommand;
    }

    protected _handlePress(): void {
        this._onPressCommand();
    }
}