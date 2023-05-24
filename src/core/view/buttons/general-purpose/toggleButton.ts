import { Button, IButton } from "./button.js";

/**
 * Interface for a button which toggles a value and then calls a provided command when pressed.
 */
export interface IToggleButton extends IButton {

}

/**
 * Class for a button which toggles a value and then calls a provided command when pressed.
 */
export class ToggleButton extends Button implements IToggleButton {
    private _onToggleCommand: (toggled: boolean) => void;

    /**
     * The name of the css variable which tracks whether the button is toggled.
     */
    private _cssToggledVariableName: string;

    public constructor(innerElement: HTMLDivElement, cssToggledVariableName: string, startToggled: boolean, onToggleCommand: (toggled: boolean) => void) {
        super(innerElement);

        this._cssToggledVariableName = cssToggledVariableName;
        this._onToggleCommand = onToggleCommand;
        
        let style = getComputedStyle(this.innerElement);
        style.setProperty(this._cssToggledVariableName, startToggled ? "1" : "0");
    }

    protected _handlePress(): void {
        let computedStyle = getComputedStyle(this.innerElement);
        let toggled = computedStyle.getPropertyValue(this._cssToggledVariableName) == "1";
        toggled = !toggled;
        this.innerElement.style.setProperty(this._cssToggledVariableName, toggled ? "1" : "0");
        this._onToggleCommand(toggled);
    }
}