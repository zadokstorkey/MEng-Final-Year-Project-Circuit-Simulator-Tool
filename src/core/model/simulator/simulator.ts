/**
 * 1 = Basic
 */
 type ISimulationType = "basic";

 /**
  * 1 = Step Voltage Source, 2 = Pulse Voltage Source, 3 = Sine Voltage Source
  */
 type ISourceType = "step" | "pulse" | "sine";
 
 /**
  * 1 = Open Circuit, 2 = Closed Circuit, 3 = Resistor, 4 = Capacitor, 5 = Inductor
  */
 type ITerminationType = "open circuit" | "closed circuit" | "resistor" | "capacitor" | "inductor";
 
 /**
  * Base interface for the simulator, encompasses the behaviour of both simulators
  */
 export interface ISimulator {
    /**
     * Takes the nessecary steps for initialising the simulator. 
     */
    initialiseSimulator(): Promise<void>;

    /**
     * Configures the simulator with a number of settings.
     * @param simulationType The type of simulation
     * @param sourceType The type of source
     * @param terminationType The type of termination
     * @param timestep How much time a single step reperesents
     * @param transmissionLineSegments The number of individual positions calculated
     * @param transmissionLineResistance The total impedence of the transmission line (not the per unit impedence)
     * @param transmissionLineConductance The total conductance of the transmission line (not the per unit conductance)
     * @param transmissionLineInductance The total inductance of the transmission line (not the per unit inductance)
     * @param transmissionLineCapacitance The total capacitance of the transmission line (not the per unit capacitance)
     * @param voltageSourceVoltage The max voltage of the voltage source
     * @param voltageSourcePeriod  The period of the voltage source (affects only to pulse and sine sources)
     * @param voltageSourcePulseLength The length of a pulse of the voltage source (affects only pulse sources)
     * @param terminatingResistance The resistance of the terminating resistor (only has an effect if there is a terminating resistor)
     * @param terminatingCapacitance The capacitance of the terminating capacitor (only has an effect if there is a terminating capacitor)
     * @param terminatingInductance The inductance of the terminating inductor (only has an effect if there is a terminating capacitor)
     */
    configureSimulator(simulationType: ISimulationType, sourceType: ISourceType, terminationType: ITerminationType, timestep: number, transmissionLineSegments: number, transmissionLineResistance: number, transmissionLineConductance: number, transmissionLineInductance: number, transmissionLineCapacitance: number, voltageSourceVoltage: number, voltageSourcePeriod: number, voltageSourcePulseLength: number, terminatingResistance: number, terminatingCapacitance: number, terminatingInductance: number): void;

    /**
     * Resets the voltages, currents and current tick to zero.
     */
    resetSimulation(): void;

    /**
     * Does a single step of the simulation.
     */
    stepSimulation(): void;

    /** 
     * Gets the current simulation tick.
     */
    getTick(): number;

    /**
     * Gets the current simulation time.
     */
    getTime(): number;

    /**
     * Gets all the values for voltages.
     */
    getVoltages(): number[];

    /**
     * Gets all the values for current.
     */
    getCurrents(): number[];
}