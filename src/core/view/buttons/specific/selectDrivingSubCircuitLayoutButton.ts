import { ISimulatorSettingsViewModel, IDrivingSubcircuitLayoutChoice } from "../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { ActionButton, IActionButton } from "../general-purpose/actionButton.js";

/**
 * Interface for a button for selecting a subcircuit layout for the driving subcircuit.
 */
export interface ISelectCircuitLayoutButton extends IActionButton {

}

/**
 * Class for a button for selecting a subcircuit layout for the driving subcircuit.
 */
export class SelectDrivingSubcircuitLayoutButton extends ActionButton implements ISelectCircuitLayoutButton {
    private _simulatorSettingsViewModel: ISimulatorSettingsViewModel;
    private _drivingSubcircuitLayoutChoice: string;

    /**
     * The name of the css variable which tracks whether the button is toggled.
     */
    private _cssSelectedVariableName: string;
    private _cssSelectedVariableValues: [string, string];
    
    private _simulatorSettingsViewModelEventHandler: () => void;

    /**
     * Extends the button class and passes through a command to update the subcircuit layout choice when the button is pressed.
     */
    public constructor(innerElement: HTMLDivElement, simulatorSettingsViewModel: ISimulatorSettingsViewModel, drivingSubcircuitLayoutChoice: IDrivingSubcircuitLayoutChoice, cssSelectedVariableName: string, cssSelectedVariableValues: [string, string]) {
        super(innerElement, () => simulatorSettingsViewModel.setDrivingSubcircuitLayoutChoice(drivingSubcircuitLayoutChoice));

        this._simulatorSettingsViewModel = simulatorSettingsViewModel;
        this._drivingSubcircuitLayoutChoice = drivingSubcircuitLayoutChoice;
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
        let newDrivingSubcircuitLayoutChoice = this._simulatorSettingsViewModel.getDrivingSubcircuitLayoutChoice();
        let selected = newDrivingSubcircuitLayoutChoice === this._drivingSubcircuitLayoutChoice;
        this.innerElement.style.setProperty(this._cssSelectedVariableName, this._cssSelectedVariableValues[selected ? 1 : 0]);
        console.log(this._cssSelectedVariableValues[selected ? 1 : 0])
    }
}