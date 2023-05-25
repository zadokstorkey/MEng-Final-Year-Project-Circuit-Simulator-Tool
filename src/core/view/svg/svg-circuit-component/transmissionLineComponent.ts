import { ISimulatorSettingsViewModel } from "../../../viewmodel/settings/simulatorSettingsViewModel.js";
import { IUIElement, UIElement } from "../../ui-element/uiElement.js";

/**
 * Interface for the behaviour of the transmission line svg element that allows you to change several properties.
 */
export interface ISVGTransmissionLineComponent extends IUIElement<SVGGElement> {

}

/**
 * Class for the behaviour of the transmission line svg element that allows you to change several properties.
 */
export class SVGTransmissionLineComponent extends UIElement<SVGGElement> implements ISVGTransmissionLineComponent {
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
        let resistance = this._simulatorSettingsViewModel.getTransmissionLineResistance();
        let newResistanceString = prompt(`Set resistance per unit length:\n(previous value was ${resistance} ohms)`);
        let newResistance = parseFloat(newResistanceString!);
        if (!isNaN(newResistance)) {
            this._simulatorSettingsViewModel.setTransmissionLineResistance(newResistance);
        }
        
        let conductance = this._simulatorSettingsViewModel.getTransmissionLineConductance();
        let newConductanceString = prompt(`Set conductance per unit length:\n(previous value was ${conductance}S)`);
        let newConductance = parseFloat(newConductanceString!);
        if (!isNaN(newConductance)) {
            this._simulatorSettingsViewModel.setTransmissionLineConductance(newConductance);
        }
        
        let inductance = this._simulatorSettingsViewModel.getTransmissionLineInductance();
        let newInductanceString = prompt(`Set inductance per unit length:\n(previous value was ${inductance}H)`);
        let newInductance = parseFloat(newInductanceString!);
        if (!isNaN(newInductance)) {
            this._simulatorSettingsViewModel.setTransmissionLineInductance(newInductance);
        }
        
        let capacitance = this._simulatorSettingsViewModel.getTransmissionLineInductance();
        let newCapacitanceString = prompt(`Set capcacitance per unit length:\n(previous value was ${capacitance}F)`);
        let newCapacitance = parseFloat(newCapacitanceString!);
        if (!isNaN(newCapacitance)) {
            this._simulatorSettingsViewModel.setTransmissionLineInductance(newCapacitance);
        }
        
        let segments = this._simulatorSettingsViewModel.getTransmissionLineSegments();
        let newSegmentsString = prompt(`Set capcacitance per unit length:\n(previous value was ${segments} segments)`);
        let newSegments = parseFloat(newSegmentsString!);
        if (!isNaN(newSegments)) {
            this._simulatorSettingsViewModel.setTransmissionLineSegments(newSegments);
        }
    }
    
    private _handleSimulatorSettingsUpdated() {
        this.innerElement.getElementsByTagName('title')[0].innerHTML = `Transmission Line (double-click to modify)\nResistance Per Unit Length: ${this._simulatorSettingsViewModel.getTransmissionLineResistance()} ohms\nConductance Per Unit Length: ${this._simulatorSettingsViewModel.getTransmissionLineConductance()}S\nInductance Per Unit Length: ${this._simulatorSettingsViewModel.getTransmissionLineInductance()}H\nCapacitance Per Unit Length: ${this._simulatorSettingsViewModel.getTransmissionLineCapacitance()}F\nSegments: ${this._simulatorSettingsViewModel.getTransmissionLineSegments()}`;
    }
}