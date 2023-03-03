import { UIElement } from "../ui-element/uiElement.js";

export abstract class Button extends UIElement {
    public constructor(innerElement: HTMLElement | SVGElement) {
        super(innerElement);
        innerElement.addEventListener('click', () => this.handleClick());
    }

    /**
     * The method to handle a DOM click event.
     */
    protected abstract handleClick(): void;
}