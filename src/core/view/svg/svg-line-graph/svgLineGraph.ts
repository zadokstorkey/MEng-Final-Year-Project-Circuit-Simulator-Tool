import { INumberArrayDataSource, NumberArrayDataSource } from "../../../viewmodel/data-source/numberArrayDataSource.js";
import { IUIElement, UIElement } from "../../ui-element/uiElement.js";

/**
 * Interface for a svg line graph element which updates when a data source changes.
 */
export interface ISVGLineGraph extends IUIElement<SVGPolylineElement> {

}

/**
 * Class for a svg line graph element which updates when a data source changes.
 */
export class SVGLineGraph extends UIElement<SVGPolylineElement> implements ISVGLineGraph {
    private _dataSource: INumberArrayDataSource;
    private _dataSourceUpdatedEventHandler: () => void;

    public constructor(innerElement: SVGPolylineElement, dataSource: INumberArrayDataSource) {
        super(innerElement);
        
        this._dataSource = dataSource;
        this._dataSourceUpdatedEventHandler = () => this._handleDataSourceUpdated();

        dataSource.addEventListener('updated', this._dataSourceUpdatedEventHandler);

        this._handleDataSourceUpdated();
    }

    public dispose(): void {
        this._dataSource.removeEventListener('updated', this._dataSourceUpdatedEventHandler);
        super.dispose();
    }

    private _handleDataSourceUpdated() {
        let arrayData = this._dataSource.getArrayData();
        let pointsString = arrayData.map((value: number, index: number) => (index / (arrayData.length - 1)).toString() + ' ' + (-value).toString()).join(', ');
        this.innerElement.setAttribute('points', pointsString);
    }
}