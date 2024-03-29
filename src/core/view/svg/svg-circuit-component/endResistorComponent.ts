import { ISimulatorSettingsViewModel } from "../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { IUIElement, UIElement } from "../../ui-element/uiElement.js";

/**
 * Interface for the behaviour of the resistor svg element that allows you to change the resistance.
 */
export interface ISVGEndResistorComponent extends IUIElement<SVGGElement> {

}

/**
 * Class for the behaviour of the resistor svg element that allows you to change the resistance.
 */
export class SVGEndResistorComponent extends UIElement<SVGGElement> implements ISVGEndResistorComponent {
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
        let resistance = this._simulatorSettingsViewModel.getEndTerminatingResistance();
        let newResistanceString = prompt(`Set resistance:\n(previous value was ${resistance} ohms)`);
        let newResistance = parseFloat(newResistanceString!);
        if (isNaN(newResistance)) {
            return;
        }
        this._simulatorSettingsViewModel.setEndTerminatingResistance(newResistance);
    }
    
    private _handleSimulatorSettingsUpdated() {
        this.innerElement.getElementsByTagName('title')[0].innerHTML = `Resistor (double-click to modify)\nResistance: ${this._simulatorSettingsViewModel.getEndTerminatingResistance()} ohms`;
    }
}