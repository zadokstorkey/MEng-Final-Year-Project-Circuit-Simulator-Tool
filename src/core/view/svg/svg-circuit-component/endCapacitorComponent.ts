import { ISimulatorSettingsViewModel } from "../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { IUIElement, UIElement } from "../../ui-element/uiElement.js";

/**
 * Interface for the behaviour of the capacitor svg element that allows you to change the capacitance.
 */
export interface ISVGEndCapacitorComponent extends IUIElement<SVGGElement> {

}

/**
 * Class for the behaviour of the capacitor svg element that allows you to change the capacitance.
 */
export class SVGEndCapacitorComponent extends UIElement<SVGGElement> implements ISVGEndCapacitorComponent {
    private _simulatorSettingsViewModel: ISimulatorSettingsViewModel;
    private _clickEventHandler: () => void;
    private _simulatorSettingsUpdatedEventHandler: () => void;
    
    public constructor(innerElement: SVGGElement, simulatorSettingsViewModel: ISimulatorSettingsViewModel) {
        super(innerElement);
        
        this._simulatorSettingsViewModel = simulatorSettingsViewModel;

        this._clickEventHandler = () => this._handleClick();
        this._simulatorSettingsUpdatedEventHandler = () => this._handleSimulatorSettingsUpdated();

        innerElement.addEventListener('dblclick', this._clickEventHandler);
        simulatorSettingsViewModel.addEventListener('updated', this._simulatorSettingsUpdatedEventHandler);

        this._handleSimulatorSettingsUpdated();
    }

    public dispose(): void {
        this.innerElement.removeEventListener('dblclick', this._clickEventHandler);
        this._simulatorSettingsViewModel.removeEventListener('updated', this._simulatorSettingsUpdatedEventHandler);
        super.dispose();
    }

    private _handleClick() {
        let capacitance = this._simulatorSettingsViewModel.getEndTerminatingCapacitance();
        let newCapacitanceString = prompt(`Set capacitance:\n(previous value was ${capacitance}F)`);
        let newCapacitance = parseFloat(newCapacitanceString!);
        if (isNaN(newCapacitance)) {
            return;
        }
        this._simulatorSettingsViewModel.setEndTerminatingCapacitance(newCapacitance);
    }
    
    private _handleSimulatorSettingsUpdated() {
        this.innerElement.getElementsByTagName('title')[0].innerHTML = `Capacitor (double-click to modify)\nCapacitance: ${this._simulatorSettingsViewModel.getEndTerminatingCapacitance()}F`;
    }
}