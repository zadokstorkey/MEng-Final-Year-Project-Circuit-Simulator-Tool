import { ISimulatorSettingsViewModel, ITerminatingSubcircuitLayoutChoice } from "../../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { ActionButton, IActionButton } from "../../general-purpose/actionButton.js";

/**
 * Interface for a button for selecting a subcircuit layout for the terminating subcircuit.
 */
export interface ISelectTerminatingSubcircuitLayoutButton extends IActionButton {

}

/**
 * Class for a button for selecting a subcircuit layout for the terminating subcircuit.
 */
export class SelectTerminatingSubcircuitLayoutButton extends ActionButton implements ISelectTerminatingSubcircuitLayoutButton {
    private _simulatorSettingsViewModel: ISimulatorSettingsViewModel;
    private _terminatingSubcircuitLayoutChoice: string;

    /**
     * The name of the css variable which tracks whether the button is toggled.
     */
    private _cssSelectedVariableName: string;
    private _cssSelectedVariableValues: [string, string];
    
    private _simulatorSettingsViewModelEventHandler: () => void;

    /**
     * Extends the button class and passes through a command to update the subcircuit layout choice when the button is pressed.
     */
    public constructor(innerElement: HTMLDivElement, simulatorSettingsViewModel: ISimulatorSettingsViewModel, terminatingSubcircuitLayoutChoice: ITerminatingSubcircuitLayoutChoice, cssSelectedVariableName: string, cssSelectedVariableValues: [string, string]) {
        super(innerElement, () => simulatorSettingsViewModel.setTerminatingSubcircuitLayoutChoice(terminatingSubcircuitLayoutChoice));

        this._simulatorSettingsViewModel = simulatorSettingsViewModel;
        this._terminatingSubcircuitLayoutChoice = terminatingSubcircuitLayoutChoice;
        this._cssSelectedVariableName = cssSelectedVariableName;
        this._cssSelectedVariableValues = cssSelectedVariableValues;
        this._simulatorSettingsViewModelEventHandler = () => this._handlesimulatorSettingsViewModelUpdated();

        simulatorSettingsViewModel.addEventListener('updated', this._simulatorSettingsViewModelEventHandler);

        this._handlesimulatorSettingsViewModelUpdated();
    }
    
    /**
     * When the choice is changed, update a css property (this is currently unused but would be used to highlight the selected option).
     */
    private _handlesimulatorSettingsViewModelUpdated() {
        let newTerminatingSubcircuitLayoutChoice = this._simulatorSettingsViewModel.getTerminatingSubcircuitLayoutChoice();
        let selected = newTerminatingSubcircuitLayoutChoice === this._terminatingSubcircuitLayoutChoice;
        this.innerElement.style.setProperty(this._cssSelectedVariableName, this._cssSelectedVariableValues[selected ? 1 : 0]);
    }
}