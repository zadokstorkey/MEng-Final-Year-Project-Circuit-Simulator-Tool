import { IUIElement, UIElement } from "../ui-element/uiElement.js";

export interface IButton extends IUIElement<HTMLDivElement> {

}

export abstract class Button extends UIElement<HTMLDivElement> implements IButton {
    private _clickEventHandler: () => void;

    public constructor(innerElement: HTMLDivElement) {
        super(innerElement);
        this._clickEventHandler = () => this._handlePress();
        innerElement.addEventListener('click', this._clickEventHandler);
    }

    public dispose(): void {
        this.innerElement.removeEventListener('click', this._clickEventHandler);
        super.dispose();
    }

    /**
     * The method to handle a DOM click event.
     */
    protected abstract _handlePress(): void;
}