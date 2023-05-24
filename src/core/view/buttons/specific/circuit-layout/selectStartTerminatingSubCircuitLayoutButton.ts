import { ISimulatorSettingsViewModel, IStartTerminatingSubcircuitLayoutChoice } from "../../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { ActionButton, IActionButton } from "../../general-purpose/actionButton.js";

/**
 * Interface for a button for selecting a subcircuit layout for the terminating subcircuit.
 */
export interface ISelectStartTerminatingSubcircuitLayoutButton extends IActionButton {

}

/**
 * Class for a button for selecting a subcircuit layout for the terminating subcircuit.
 */
export class SelectStartTerminatingSubcircuitLayoutButton extends ActionButton implements ISelectStartTerminatingSubcircuitLayoutButton {
    private _simulatorSettingsViewModel: ISimulatorSettingsViewModel;
    private _startTerminatingSubcircuitLayoutChoice: string;

    /**
     * The name of the css variable which tracks whether the button is toggled.
     */
    private _cssSelectedVariableName: string;
    private _cssSelectedVariableValues: [string, string];
    
    private _simulatorSettingsViewModelEventHandler: () => void;

    /**
     * Extends the button class and passes through a command to update the subcircuit layout choice when the button is pressed.
     */
    public constructor(innerElement: HTMLDivElement, simulatorSettingsViewModel: ISimulatorSettingsViewModel, startTerminatingSubcircuitLayoutChoice: IStartTerminatingSubcircuitLayoutChoice, cssSelectedVariableName: string, cssSelectedVariableValues: [string, string]) {
        super(innerElement, () => simulatorSettingsViewModel.setStartTerminatingSubcircuitLayoutChoice(startTerminatingSubcircuitLayoutChoice));

        this._simulatorSettingsViewModel = simulatorSettingsViewModel;
        this._startTerminatingSubcircuitLayoutChoice = startTerminatingSubcircuitLayoutChoice;
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
        let newStartTerminatingSubcircuitLayoutChoice = this._simulatorSettingsViewModel.getStartTerminatingSubcircuitLayoutChoice();
        let selected = newStartTerminatingSubcircuitLayoutChoice === this._startTerminatingSubcircuitLayoutChoice;
        this.innerElement.style.setProperty(this._cssSelectedVariableName, this._cssSelectedVariableValues[selected ? 1 : 0]);
        console.log("Start Termination: Selected", newStartTerminatingSubcircuitLayoutChoice);
    }
}