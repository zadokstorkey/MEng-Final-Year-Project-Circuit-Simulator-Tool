import { UIElement } from "../ui-element/uiElement.js";

export class Sidebar extends UIElement<HTMLDivElement> {
    public constructor(innerElement: HTMLDivElement) {
        super(innerElement);
    }
}