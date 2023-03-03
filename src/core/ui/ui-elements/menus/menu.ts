import { Button } from "../buttons/button.js";
import { UIElement } from "../ui-element/uiElement.js";

export abstract class Menu extends UIElement {
    public constructor(innerElement: HTMLElement | SVGElement, ...buttons: Button[]) {
        super(innerElement, ...buttons);
    }
}