import { ISimulator } from "../../model/simulator/simulator.js";
import { INotifyOnUpdate, NotifyOnUpdate } from "../../shared/notifyOnUpdate.js";

export type ICircuitLayoutChoice = 'basic';
export type IDrivingSubcircuitLayoutChoice = 'step' | 'pulse' | 'sine';
export type ITerminatingSubcircuitLayoutChoice = 'open circuit' | 'closed circuit' | 'resistor' | 'capacitor' | 'inductor';

/**
 * ViewModel interface for the simulator settings. The job of this ViewModel is to store the current simulator settings that need to be displayed and also to update the simulator when those settings are changed.
 */
export interface ISimulatorSettingsViewModel extends INotifyOnUpdate {
    getCircuitLayoutChoice(): ICircuitLayoutChoice;
    setCircuitLayoutChoice(value: ICircuitLayoutChoice): void;
    getDrivingSubcircuitLayoutChoice(): IDrivingSubcircuitLayoutChoice;
    setDrivingSubcircuitLayoutChoice(value: IDrivingSubcircuitLayoutChoice): void;
    getTerminatingSubcircuitLayoutChoice(): ITerminatingSubcircuitLayoutChoice;
    setTerminatingSubcircuitLayoutChoice(value: ITerminatingSubcircuitLayoutChoice): void;
    getTransmissionLineSegments(): number;
    setTransmissionLineSegments(value: number): void;
    getTransmissionLineResistance(): number;
    setTransmissionLineResistance(value: number): void;
    getTransmissionLineConductance(): number;
    setTransmissionLineConductance(value: number): void;
    getTransmissionLineInductance(): number;
    setTransmissionLineInductance(value: number): void;
    getTransmissionLineCapacitance(): number;
    setTransmissionLineCapacitance(value: number): void;
    getVoltageSourceVoltage(): number;
    setVoltageSourceVoltage(value: number): void;
    getVoltageSourcePeriod(): number;
    setVoltageSourcePeriod(value: number): void;
    getVoltageSourcePulseDuration(): number;
    setVoltageSourcePulseDuration(value: number): void;
    getTerminatingResistance(): number;
    setTerminatingResistance(value: number): void;
    getTerminatingCapacitance(): number;
    setTerminatingCapacitance(value: number): void;
    getTerminatingInductance(): number;
    setTerminatingInductance(value: number): void;
}

/**
 * ViewModel class for the simulator settings. The job of this ViewModel is to store the current simulator settings that need to be displayed and also to update the simulator when those settings are changed.
 */
export class SimulatorSettingsViewModel extends NotifyOnUpdate implements ISimulatorSettingsViewModel {
    private _simulator: ISimulator;
    private _circuitLayoutChoice: ICircuitLayoutChoice;
    private _drivingSubcircuitLayoutChoice: IDrivingSubcircuitLayoutChoice;
    private _terminatingSubcircuitLayoutChoice: ITerminatingSubcircuitLayoutChoice;
    private _timestep: number;
    private _transmissionLineSegments: number;
    private _transmissionLineResistance: number;
    private _transmissionLineConductance: number;
    private _transmissionLineInductance: number;
    private _transmissionLineCapacitance: number;
    private _voltageSourceVoltage: number;
    private _voltageSourcePeriod: number;
    private _voltageSourcePulseLength: number;
    private _terminatingResistance: number;
    private _terminatingCapacitance: number;
    private _terminatingInductance: number;

    public constructor(simulator: ISimulator, circuitLayoutChoice: ICircuitLayoutChoice, drivingSubcircuitLayoutChoice: IDrivingSubcircuitLayoutChoice, terminatingSubcircuitLayoutChoice: ITerminatingSubcircuitLayoutChoice, timestep: number, transmissionLineSegments: number, transmissionLineResistance: number, transmissionLineConductance: number, transmissionLineInductance: number, transmissionLineCapacitance: number, voltageSourceVoltage: number, voltageSourcePeriod: number, voltageSourcePulseLength: number, terminatingResistance: number, terminatingInductance: number, terminatingCapacitance: number) {
        super();
        this._simulator = simulator;
        this._circuitLayoutChoice = circuitLayoutChoice;
        this._drivingSubcircuitLayoutChoice = drivingSubcircuitLayoutChoice;
        this._terminatingSubcircuitLayoutChoice = terminatingSubcircuitLayoutChoice;
        this._timestep = timestep;
        this._transmissionLineSegments = transmissionLineSegments;
        this._transmissionLineResistance = transmissionLineResistance;
        this._transmissionLineConductance = transmissionLineConductance;
        this._transmissionLineCapacitance = transmissionLineCapacitance;
        this._transmissionLineInductance = transmissionLineInductance
        this._voltageSourceVoltage = voltageSourceVoltage;
        this._voltageSourcePeriod = voltageSourcePeriod;
        this._voltageSourcePulseLength = voltageSourcePulseLength;
        this._terminatingResistance = terminatingResistance;
        this._terminatingCapacitance = terminatingCapacitance;
        this._terminatingInductance = terminatingInductance;
        this._updateSimulator();
    }

    public getCircuitLayoutChoice(): ICircuitLayoutChoice {
        return this._circuitLayoutChoice;
    }

    public setCircuitLayoutChoice(value: ICircuitLayoutChoice): void {
        this._circuitLayoutChoice = value;
        this._invokeUpdated();
        this._updateSimulator();
    }
    
    public getDrivingSubcircuitLayoutChoice(): IDrivingSubcircuitLayoutChoice {
        return this._drivingSubcircuitLayoutChoice;
    }

    public setDrivingSubcircuitLayoutChoice(value: IDrivingSubcircuitLayoutChoice): void {
        this._drivingSubcircuitLayoutChoice = value;
        this._invokeUpdated();
        this._updateSimulator();
    }
    
    public getTerminatingSubcircuitLayoutChoice(): ITerminatingSubcircuitLayoutChoice {
        return this._terminatingSubcircuitLayoutChoice;
    }

    public setTerminatingSubcircuitLayoutChoice(value: ITerminatingSubcircuitLayoutChoice): void {
        this._terminatingSubcircuitLayoutChoice = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getTransmissionLineSegments(): number {
        return this._transmissionLineSegments;
    }

    public setTransmissionLineSegments(value: number): void {
        this._transmissionLineSegments = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getTransmissionLineResistance(): number {
        return this._transmissionLineResistance;
    }

    public setTransmissionLineResistance(value: number): void {
        this._transmissionLineResistance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getTransmissionLineConductance(): number {
        return this._transmissionLineConductance
    }

    public setTransmissionLineConductance(value: number): void {
        this._transmissionLineConductance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getTransmissionLineInductance(): number {
        return this._transmissionLineInductance;
    }

    public setTransmissionLineInductance(value: number): void {
        this._transmissionLineInductance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getTransmissionLineCapacitance(): number {
        return this._transmissionLineCapacitance;
    }

    public setTransmissionLineCapacitance(value: number): void {
        this._transmissionLineCapacitance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getVoltageSourceVoltage(): number {
        return this._voltageSourceVoltage;
    }

    public setVoltageSourceVoltage(value: number): void {
        this._voltageSourceVoltage = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getVoltageSourcePeriod(): number {
        return this._voltageSourcePeriod;
    }

    public setVoltageSourcePeriod(value: number): void {
        this._voltageSourcePulseLength = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getVoltageSourcePulseDuration(): number {
        return this._voltageSourcePulseLength;
    }

    public setVoltageSourcePulseDuration(value: number): void {
        this._voltageSourcePulseLength = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getTerminatingResistance(): number {
        return this._terminatingResistance;
    }

    public setTerminatingResistance(value: number): void {
        this._terminatingResistance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getTerminatingCapacitance(): number {
        return this._terminatingCapacitance;
    }

    public setTerminatingCapacitance(value: number): void {
        this._terminatingCapacitance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getTerminatingInductance(): number {
        return this._terminatingInductance;
    }

    public setTerminatingInductance(value: number): void {
        this._terminatingInductance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    private _updateSimulator() {
        this._simulator.configureSimulator(this._circuitLayoutChoice, this._drivingSubcircuitLayoutChoice, this._terminatingSubcircuitLayoutChoice, this._timestep, this._transmissionLineSegments, this._transmissionLineResistance, this._transmissionLineConductance, this._transmissionLineInductance, this._transmissionLineCapacitance, this._voltageSourceVoltage, this._voltageSourcePeriod, this._voltageSourcePulseLength, this._terminatingResistance, this._terminatingCapacitance, this._terminatingInductance);
    }
}