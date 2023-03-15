export interface IDisposableObject {
    dispose(): void;
}

export class DisposableObject implements IDisposableObject {
    protected _disposed: boolean = false;

    public dispose(): void {
        if (this._disposed) {
            throw new Error('Object has already been disposed.');
        }
        this._disposed = true;
    }
}
