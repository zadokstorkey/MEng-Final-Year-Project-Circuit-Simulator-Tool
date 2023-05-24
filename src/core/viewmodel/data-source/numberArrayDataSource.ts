import { INotifyOnUpdate, NotifyOnUpdate } from "../../shared/notifyOnUpdate.js";

/**
 * Data source consisting of an array of numbers, sends update events.
 */
export interface INumberArrayDataSource extends INotifyOnUpdate {
    getArrayData(): Array<number>;
    setArrayData(value: Array<number>): void;
}

/**
 * Data source consisting of an array of numbers, sends update events.
 */
export class NumberArrayDataSource extends NotifyOnUpdate implements INumberArrayDataSource {
    private _arrayData: Array<number>;

    public constructor(arrayData: Array<number>) {
        super();
        this._arrayData = arrayData;
    }

    public getArrayData(): Array<number> {
        return this._arrayData;
    }

    public setArrayData(value: Array<number>): void {
        this._arrayData = value;
        this._invokeUpdated();
    }
}