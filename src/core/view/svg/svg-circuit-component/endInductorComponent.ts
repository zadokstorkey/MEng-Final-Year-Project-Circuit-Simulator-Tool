import { ISimulatorSettingsViewModel } from "../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { IUIElement, UIElement } from "../../ui-element/uiElement.js";

/**
 * Interface for the behaviour of the inductor svg element that allows you to change the inductance.
 */
export interface ISVGEndInductorComponent extends IUIElement<SVGGElement> {

}

/**
 * Class for the behaviour of the inductor svg element that allows you to change the inductance.
 */
export class SVGEndInductorComponent extends UIElement<SVGGElement> implements ISVGEndInductorComponent {
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
        let inductance = this._simulatorSettingsViewModel.getEndTerminatingInductance();
        let newInductanceString = prompt(`Set inductance:\n(previous value was ${inductance} ohms)`);
        let newInductance = parseFloat(newInductanceString!);
        if (isNaN(newInductance)) {
            return;
        }
        this._simulatorSettingsViewModel.setEndTerminatingInductance(newInductance);
    }
    
    private _handleSimulatorSettingsUpdated() {
        this.innerElement.getElementsByTagName('title')[0].innerHTML = `Inductor (double-click to modify)\nInductance: ${this._simulatorSettingsViewModel.getEndTerminatingInductance()}H`;
    }
}