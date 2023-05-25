import { ISimulatorSettingsViewModel } from "../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { IUIElement, UIElement } from "../../ui-element/uiElement.js";

/**
 * Interface for the behaviour of the sine voltage source svg element that allows you to change the voltage, period and pulse length.
 */
export interface ISVGPulseVoltageSourceComponent extends IUIElement<SVGGElement> {

}

/**
 * Class for the behaviour of the pulse voltage source svg element that allows you to change the voltage, period and pulse length.
 */
export class SVGPulseVoltageSourceComponent extends UIElement<SVGGElement> implements ISVGPulseVoltageSourceComponent {
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
        // Set voltage
        let voltageSourceVoltage = this._simulatorSettingsViewModel.getVoltageSourceVoltage();
        let newVoltageSourceVoltageString = prompt(`Set voltage source voltage:\n(previous value was ${voltageSourceVoltage}V)`);
        let newVoltageSourceVoltage = parseFloat(newVoltageSourceVoltageString!);
        if (!isNaN(newVoltageSourceVoltage)) {
            this._simulatorSettingsViewModel.setVoltageSourceVoltage(newVoltageSourceVoltage);
        }
        
        // Set period
        let voltageSourcePeriod = this._simulatorSettingsViewModel.getVoltageSourcePeriod();
        let newVoltageSourcePeriodString = prompt(`Set voltage source period:\n(previous value was ${voltageSourcePeriod}s)`);
        let newVoltageSourcePeriod = parseFloat(newVoltageSourcePeriodString!);
        if (!isNaN(newVoltageSourcePeriod)) {
            this._simulatorSettingsViewModel.setVoltageSourcePeriod(newVoltageSourcePeriod);
        }
        
        // Set pulse duration
        let voltageSourcePulseDuration = this._simulatorSettingsViewModel.getVoltageSourcePulseDuration();
        let newVoltageSourcePulseDurationString = prompt(`Set voltage source pulse duration:\n(previous value was ${voltageSourcePulseDuration}s)`);
        let newVoltageSourcePulseDuration = parseFloat(newVoltageSourcePulseDurationString!);
        if (!isNaN(newVoltageSourcePulseDuration)) {
            this._simulatorSettingsViewModel.setVoltageSourcePulseDuration(newVoltageSourcePulseDuration);
        }
    }
    
    private _handleSimulatorSettingsUpdated() {
        this.innerElement.getElementsByTagName('title')[0].innerHTML = `Pulse Voltage Source (double-click to modify)\nVoltage: ${this._simulatorSettingsViewModel.getVoltageSourceVoltage()}V\nPeriod: ${this._simulatorSettingsViewModel.getVoltageSourcePeriod()}s\nPulse Length: ${this._simulatorSettingsViewModel.getVoltageSourcePulseDuration()}s`;
    }
}