import { ICircuitLayoutChoice, ISimulatorSettingsViewModel } from "../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { ActionButton, IActionButton } from "../general-purpose/actionButton.js";

/**
 * Interface for a button for selecting a circuit layout.
 */
export interface ISelectCircuitLayoutButton extends IActionButton {

}

/**
 * Class for a button for selecting a circuit layout.
 */
export class SelectCircuitLayoutButton extends ActionButton implements ISelectCircuitLayoutButton {
    private _simulatorSettingsViewModel: ISimulatorSettingsViewModel;
    private _circuitLayoutChoice: string;

    /**
     * The name of the css variable which tracks whether the button is toggled.
     */
    private _cssSelectedVariableName: string;
    private _cssSelectedVariableValues: [string, string];
    
    private _circuitLayoutChoiceViewModelEventHandler: () => void;

    /**
     * Extends the button class and passes through a command to update the circuit layout choice when the button is pressed.
     */
    public constructor(innerElement: HTMLDivElement, simulatorSettingsViewModel: ISimulatorSettingsViewModel, circuitLayoutChoice: ICircuitLayoutChoice, cssSelectedVariableName: string, cssSelectedVariableValues: [string, string]) {
        super(innerElement, () => simulatorSettingsViewModel.setCircuitLayoutChoice(circuitLayoutChoice));

        this._simulatorSettingsViewModel = simulatorSettingsViewModel;
        this._circuitLayoutChoice = circuitLayoutChoice;
        this._cssSelectedVariableName = cssSelectedVariableName;
        this._cssSelectedVariableValues = cssSelectedVariableValues;
        this._circuitLayoutChoiceViewModelEventHandler = () => this._handlecircuitLayoutChoiceViewModelUpdated();

        simulatorSettingsViewModel.addEventListener('updated', this._circuitLayoutChoiceViewModelEventHandler);

        this._handlecircuitLayoutChoiceViewModelUpdated();
    }
    
    /**
     * When the choice is changed, update a css property (this is currently unused but would be used to highlight the selected option).
     */
    private _handlecircuitLayoutChoiceViewModelUpdated() {
        let newCircuitLayoutChoice = this._simulatorSettingsViewModel.getCircuitLayoutChoice();
        let selected = newCircuitLayoutChoice === this._circuitLayoutChoice;
        this.innerElement.style.setProperty(this._cssSelectedVariableName, this._cssSelectedVariableValues[selected ? 1 : 0]);
        console.log(this._cssSelectedVariableValues[selected ? 1 : 0])
    }
}