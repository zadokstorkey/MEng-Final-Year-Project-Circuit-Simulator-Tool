import { ISimulatorSettingsViewModel } from "../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { IUIElement, UIElement } from "../../ui-element/uiElement.js";

/**
 * Interface for the behaviour of the inductor svg element that allows you to change the inductance.
 */
export interface ISVGStartInductorComponent extends IUIElement<SVGGElement> {

}

/**
 * Class for the behaviour of the inductor svg element that allows you to change the inductance.
 */
export class SVGStartInductorComponent extends UIElement<SVGGElement> implements ISVGStartInductorComponent {
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
        let inductance = this._simulatorSettingsViewModel.getStartTerminatingInductance();
        let newInductanceString = prompt(`Set inductance:\n(previous value was ${inductance} ohms)`);
        let newInductance = parseFloat(newInductanceString!);
        this._simulatorSettingsViewModel.setStartTerminatingInductance(newInductance);
    }
    
    private _handleSimulatorSettingsUpdated() {
        this.innerElement.getElementsByTagName('title')[0].innerHTML = `${this._simulatorSettingsViewModel.getStartTerminatingInductance()}H (double-click to modify)`;
    }
}