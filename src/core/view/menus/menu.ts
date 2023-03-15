import { Button } from "../buttons/button.js";
import { UIElement } from "../ui-element/uiElement.js";

export abstract class Menu extends UIElement<HTMLDivElement> {
    public constructor(innerElement: HTMLDivElement, ...buttons: Button[]) {
        super(innerElement, ...buttons);
    }
}