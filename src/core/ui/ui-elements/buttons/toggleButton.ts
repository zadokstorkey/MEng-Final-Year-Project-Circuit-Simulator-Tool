import { Button } from "./button.js";

export class ToggleButton extends Button {
    /**
     * The name of the css variable which tracks whether the button is toggled.
     */
    private _cssToggledVariableName: string;

    /**
     * The function to run when the button is toggled.
     */
    private _onToggle: (toggled: boolean) => void;

    public constructor(innerElement: HTMLElement | SVGElement, cssToggledVariableName: string) {
        super(innerElement);
        this._cssToggledVariableName = cssToggledVariableName;

        // The on-toggle function should default to a no-op value
        this._onToggle = (toggled) => {};
    }

    /**
     * Sets the function to run when the button is toggled.
     * @param onToggle The function to run when the button is toggled.
     */
    public setOnToggle(onToggle: (toggled: boolean) => void) {
        this._onToggle = onToggle;
    }

    /**
     * The method to handle a DOM click event. Modifies the css property to track whether the button is pressed and then calls the on-toggle function.
     */
    protected handleClick(): void {
        let style = getComputedStyle(this.innerElement);
        let toggled = style.getPropertyValue(this._cssToggledVariableName) == "1";
        toggled = !toggled;
        style.setProperty(this._cssToggledVariableName, toggled ? "1" : "0");
        this._onToggle(toggled);
    }
}