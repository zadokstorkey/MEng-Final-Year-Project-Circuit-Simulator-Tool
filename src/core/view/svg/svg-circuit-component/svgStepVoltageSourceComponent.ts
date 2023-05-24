import { ISimulatorSettingsViewModel } from "../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { IUIElement, UIElement } from "../../ui-element/uiElement.js";

/**
 * Interface for the behaviour of the step voltage source svg element that allows you to change the voltage.
 */
export interface ISVGStepVoltageSourceComponent extends IUIElement<SVGGElement> {

}

/**
 * Class for the behaviour of the step voltage source svg element that allows you to change the voltage.
 */
export class SVGStepVoltageSourceComponent extends UIElement<SVGGElement> implements ISVGStepVoltageSourceComponent {
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
        let voltageSourceVoltage = this._simulatorSettingsViewModel.getVoltageSourceVoltage();
        let newVoltageSourceVoltageString = prompt(`Set voltage source voltage:\n(previous value was ${voltageSourceVoltage}V)`);
        let newVoltageSourceVoltage = parseFloat(newVoltageSourceVoltageString!);
        this._simulatorSettingsViewModel.setVoltageSourceVoltage(newVoltageSourceVoltage);
    }
    
    private _handleSimulatorSettingsUpdated() {
        this.innerElement.getElementsByTagName('title')[0].innerHTML = `${this._simulatorSettingsViewModel.getVoltageSourceVoltage()}V (double-click to modify)`;
    }
}