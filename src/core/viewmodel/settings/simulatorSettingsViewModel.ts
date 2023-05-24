import { ISimulator } from "../../model/simulator/simulator.js";
import { INotifyOnUpdate, NotifyOnUpdate } from "../../shared/notifyOnUpdate.js";

export type ICircuitLayoutChoice = 'basic';
export type IDrivingSubcircuitLayoutChoice = 'step' | 'pulse' | 'sine';
export type IStartTerminatingSubcircuitLayoutChoice = 'closed circuit' | 'resistor' | 'capacitor' | 'inductor';
export type ITerminatingSubcircuitLayoutChoice = 'open circuit' | 'closed circuit' | 'resistor' | 'capacitor' | 'inductor';

/**
 * ViewModel interface for the simulator settings. The job of this ViewModel is to store the current simulator settings that need to be displayed and also to update the simulator when those settings are changed.
 */
export interface ISimulatorSettingsViewModel extends INotifyOnUpdate {
    getCircuitLayoutChoice(): ICircuitLayoutChoice;
    setCircuitLayoutChoice(value: ICircuitLayoutChoice): void;
    getDrivingSubcircuitLayoutChoice(): IDrivingSubcircuitLayoutChoice;
    setDrivingSubcircuitLayoutChoice(value: IDrivingSubcircuitLayoutChoice): void;
    getStartTerminatingSubcircuitLayoutChoice(): IStartTerminatingSubcircuitLayoutChoice;
    setStartTerminatingSubcircuitLayoutChoice(value: IStartTerminatingSubcircuitLayoutChoice): void;
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
    getStartTerminatingResistance(): number;
    setStartTerminatingResistance(value: number): void;
    getStartTerminatingCapacitance(): number;
    setStartTerminatingCapacitance(value: number): void;
    getStartTerminatingInductance(): number;
    setStartTerminatingInductance(value: number): void;
    getEndTerminatingResistance(): number;
    setEndTerminatingResistance(value: number): void;
    getEndTerminatingCapacitance(): number;
    setEndTerminatingCapacitance(value: number): void;
    getEndTerminatingInductance(): number;
    setEndTerminatingInductance(value: number): void;
}

/**
 * ViewModel class for the simulator settings. The job of this ViewModel is to store the current simulator settings that need to be displayed and also to update the simulator when those settings are changed.
 */
export class SimulatorSettingsViewModel extends NotifyOnUpdate implements ISimulatorSettingsViewModel {
    private _simulator: ISimulator;
    private _circuitLayoutChoice: ICircuitLayoutChoice;
    private _drivingSubcircuitLayoutChoice: IDrivingSubcircuitLayoutChoice;
    private _startTerminatingSubcircuitLayoutChoice: IStartTerminatingSubcircuitLayoutChoice;
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
    private _startTerminatingResistance: number;
    private _startTerminatingCapacitance: number;
    private _startTerminatingInductance: number;
    private _endTerminatingResistance: number;
    private _endTerminatingCapacitance: number;
    private _endTerminatingInductance: number;

    public constructor(simulator: ISimulator, circuitLayoutChoice: ICircuitLayoutChoice, drivingSubcircuitLayoutChoice: IDrivingSubcircuitLayoutChoice, startTerminatingSubcircuitLayoutChoice: IStartTerminatingSubcircuitLayoutChoice, terminatingSubcircuitLayoutChoice: ITerminatingSubcircuitLayoutChoice, timestep: number, transmissionLineSegments: number, transmissionLineResistance: number, transmissionLineConductance: number, transmissionLineInductance: number, transmissionLineCapacitance: number, voltageSourceVoltage: number, voltageSourcePeriod: number, voltageSourcePulseLength: number, startTerminatingResistance: number, startTerminatingCapacitance: number, startTerminatingInductance: number, endTerminatingResistance: number, endTerminatingCapacitance: number, endTerminatingInductance: number) {
        super();
        this._simulator = simulator;
        this._circuitLayoutChoice = circuitLayoutChoice;
        this._drivingSubcircuitLayoutChoice = drivingSubcircuitLayoutChoice;
        this._startTerminatingSubcircuitLayoutChoice = startTerminatingSubcircuitLayoutChoice;
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
        this._startTerminatingResistance = startTerminatingResistance;
        this._startTerminatingCapacitance = startTerminatingCapacitance;
        this._startTerminatingInductance = startTerminatingInductance;
        this._endTerminatingResistance = endTerminatingResistance;
        this._endTerminatingCapacitance = endTerminatingCapacitance;
        this._endTerminatingInductance = endTerminatingInductance;
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
    
    public getStartTerminatingSubcircuitLayoutChoice(): IStartTerminatingSubcircuitLayoutChoice {
        return this._startTerminatingSubcircuitLayoutChoice;
    }

    public setStartTerminatingSubcircuitLayoutChoice(value: IStartTerminatingSubcircuitLayoutChoice): void {
        this._startTerminatingSubcircuitLayoutChoice = value;
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
        this._voltageSourcePeriod = value;
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

    public getStartTerminatingResistance(): number {
        return this._startTerminatingResistance;
    }

    public setStartTerminatingResistance(value: number): void {
        this._startTerminatingResistance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getStartTerminatingCapacitance(): number {
        return this._startTerminatingCapacitance;
    }

    public setStartTerminatingCapacitance(value: number): void {
        this._startTerminatingCapacitance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getStartTerminatingInductance(): number {
        return this._startTerminatingInductance;
    }

    public setStartTerminatingInductance(value: number): void {
        this._startTerminatingInductance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getEndTerminatingResistance(): number {
        return this._endTerminatingResistance;
    }

    public setEndTerminatingResistance(value: number): void {
        this._endTerminatingResistance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getEndTerminatingCapacitance(): number {
        return this._endTerminatingCapacitance;
    }

    public setEndTerminatingCapacitance(value: number): void {
        this._endTerminatingCapacitance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    public getEndTerminatingInductance(): number {
        return this._endTerminatingInductance;
    }

    public setEndTerminatingInductance(value: number): void {
        this._endTerminatingInductance = value;
        this._invokeUpdated();
        this._updateSimulator();
    }

    private _updateSimulator() {
        this._simulator.configureSimulator(this._circuitLayoutChoice, this._drivingSubcircuitLayoutChoice, this._startTerminatingSubcircuitLayoutChoice, this._terminatingSubcircuitLayoutChoice, this._timestep, this._transmissionLineSegments, this._transmissionLineResistance, this._transmissionLineConductance, this._transmissionLineInductance, this._transmissionLineCapacitance, this._voltageSourceVoltage, this._voltageSourcePeriod, this._voltageSourcePulseLength, this._startTerminatingResistance, this._startTerminatingCapacitance, this._startTerminatingInductance, this._endTerminatingResistance, this._endTerminatingCapacitance, this._endTerminatingInductance);
    }
}