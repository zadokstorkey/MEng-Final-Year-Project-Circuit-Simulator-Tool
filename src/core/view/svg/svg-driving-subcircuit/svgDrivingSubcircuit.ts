import { ISimulatorSettingsViewModel } from "../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { NumberArrayDataSource } from "../../../viewmodel/data-source/numberArrayDataSource.js";
import { IUIElement, UIElement } from "../../ui-element/uiElement.js";

/**
 * Interface for a driving subcircuit svg element whose visibility depends on whether that subcircuit has been selected.
 */
export interface ISVGDrivingSubcircuit extends IUIElement<SVGGElement> {

}

/**
 * Class for a driving subcircuit svg element whose visibility depends on whether that subcircuit has been selected.
 */
export class SVGDrivingSubcircuit extends UIElement<SVGGElement> implements ISVGDrivingSubcircuit {
    private _simulatorSettingsViewModel: ISimulatorSettingsViewModel;
    private _name;
    private _simulatorSettingsUpdatedEventHandler: () => void;

    public constructor(innerElement: SVGGElement, name: string, simulatorSettingsViewModel: ISimulatorSettingsViewModel) {
        super(innerElement);
        
        this._simulatorSettingsViewModel = simulatorSettingsViewModel;
        this._name = name;
        this._simulatorSettingsUpdatedEventHandler = () => this._handleSimulatorSettingsUpdated();

        simulatorSettingsViewModel.addEventListener('updated', this._simulatorSettingsUpdatedEventHandler);

        this._handleSimulatorSettingsUpdated();
    }

    public dispose(): void {
        this._simulatorSettingsViewModel.removeEventListener('updated', this._simulatorSettingsUpdatedEventHandler);
        super.dispose();
    }

    private _handleSimulatorSettingsUpdated() {
        let drivingCircuitChoice = this._simulatorSettingsViewModel.getDrivingSubcircuitLayoutChoice();
        let isCurrentChoice = drivingCircuitChoice == this._name;
        this.innerElement.style.display = isCurrentChoice ? 'block' : 'none';
    }
}