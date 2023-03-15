import { IEventEmitter } from "../../shared/eventEmitter.js";
import { INotifyOnUpdate, NotifyOnUpdate } from "../../shared/notifyOnUpdate.js";

export interface INumberArrayDataSource extends INotifyOnUpdate {
    getArrayData(): Array<number>;
    setArrayData(value: Array<number>): void;
}

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