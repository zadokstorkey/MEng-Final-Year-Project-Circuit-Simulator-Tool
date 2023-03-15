import { UIElement } from "../../ui-element/uiElement.js";

export class SVGCanvas extends UIElement<HTMLElement & SVGSVGElement> {
    public constructor(innerElement: HTMLElement & SVGSVGElement) {
        super(innerElement);
    }
}