import { Button } from "./button.js";

export class ActionButton extends Button {
    /**
     * The action to run when the button is clicked.
     */
    private _onClick: () => void;

    public constructor(innerElement: HTMLElement | SVGElement)
    {
        super(innerElement);

        // The on-click action should default to a no-op value
        this._onClick = () => {};
    }

    /**
     * Sets the action to run when the button is clicked.
     * @param onClick The action to run when the button is clicked.
     */
    public setOnClick(onClick: () => void): void {
        this._onClick = onClick;
    }

    /**
     * The method to handle a DOM click event. Calls the stored action.
     */
    protected handleClick(): void {
        this._onClick();
    }
}