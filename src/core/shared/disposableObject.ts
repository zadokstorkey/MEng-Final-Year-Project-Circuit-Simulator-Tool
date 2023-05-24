/**
 * Interface for objects with disposal steps. Mostly used in this program for objects which need to remove event handlers before deletion.
 */
export interface IDisposableObject {
    dispose(): void;
}

/**
 * Abstract class for objects with disposal steps. Mostly used in this program for objects which need to remove event handlers before deletion.
 */
export abstract class DisposableObject implements IDisposableObject {
    protected _disposed: boolean = false;

    public dispose(): void {
        if (this._disposed) {
            throw new Error('Object has already been disposed.');
        }
        this._disposed = true;
    }
}
