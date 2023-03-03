export abstract class UIElement {
    /**
     * The inner DOM element that this UIElement wraps.
     */
    public readonly innerElement: HTMLElement | SVGElement;

    public constructor(innerElement: HTMLElement | SVGElement, ...childNodes: UIElement[]) {
        // Assert that the inner DOM element actually exists
        if (innerElement == undefined) {
            throw new Error('Supplied inner element is undefined.');
        }

        // Store the inner DOM element for later
        this.innerElement = innerElement;

        // Assert that all supplied child nodes are actually child nodes in the DOM
        childNodes.forEach((childNode: UIElement) => {
            this.assertIsAncestorOf(childNode);
        });
    }

    /**
     * Throws an error if this is not an ancestor of the supplied UIElement.
     * @param otherElement The UI element to check.
     */
    public assertIsAncestorOf(otherElement: UIElement): void {
        // Simply throw an error if isAncestorOf returns false
        if (!this.isAncestorOf(otherElement)) {
            throw new Error('Supplied element is not a child of this element.');
        }
    }

    /**
     * Determines whether this is an ancestor of the supplied UIElement.
     * @param otherElement The UIElement to check.
     * @returns Whether this is an ancestor of the supplied UIElement
     */
    public isAncestorOf(otherElement: UIElement): boolean {
        // Iterate up the DOM heirachy by starting with the supplied UIElement's inner DOM element and getting the parent of each DOM element
        for (let elementToCheck = otherElement.innerElement.parentElement; elementToCheck != null; elementToCheck = elementToCheck!.parentElement) {
            // If the current element is this element's inner DOM element, then this element is an ancestor
            if (elementToCheck == this.innerElement) {
                return true;
            }
        }

        // If we have traversed the DOM heirachy without finding this element's inner DOM element, then this element must not be an ancestor
        return false;
    }
}