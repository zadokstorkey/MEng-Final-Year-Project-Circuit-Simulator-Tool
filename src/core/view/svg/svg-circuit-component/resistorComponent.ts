import { ISimulatorSettingsViewModel } from "../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { IUIElement, UIElement } from "../../ui-element/uiElement.js";

/**
 * Interface for the behaviour of the resistor svg element that allows you to change the resistance.
 */
export interface ISVGResistorComponent extends IUIElement<SVGGElement> {

}

/**
 * Class for the behaviour of the resistor svg element that allows you to change the resistance.
 */
export class SVGResistorComponent extends UIElement<SVGGElement> implements ISVGResistorComponent {
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
        let resistance = this._simulatorSettingsViewModel.getTerminatingResistance();
        let newResistanceString = prompt(`Set resistance:\n(previous value was ${resistance} ohms)`);
        let newResistance = parseFloat(newResistanceString!);
        this._simulatorSettingsViewModel.setTerminatingResistance(newResistance);
    }
    
    private _handleSimulatorSettingsUpdated() {
        this.innerElement.getElementsByTagName('title')[0].innerHTML = `${this._simulatorSettingsViewModel.getTerminatingResistance()} ohms (double-click to modify)`;
    }
}