import init, { configureSimulator, getCurrents, getTick, getTime, getVoltages, resetSimulation, stepSimulation } from "../../../webassembly-simulator/pkg/webassembly_simulator.js";
import { ISimulator } from "./simulator";

export class WebAssemblySimulator implements ISimulator {
    public async initialiseSimulator(): Promise<void> {
        /**
         * Takes the nessecary steps for initialising the simulator. In the case of this WebAssembly simulator, it calls the generated function to load the WebAssembly file for the simulator.
         */
        await init();
    }

    /**
     * Configures the simulator with a number of settings.
     * @param simulationType The type of simulation
     * @param sourceType The type of source
     * @param startTerminationType The type of termination at the start of the transmission line
     * @param endTerminationType The type of termination at the end of the transmission line
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
    public configureSimulator(simulationType: "basic", sourceType: "step" | "pulse" | "sine", startTerminationType: "closed circuit" | "resistor" | "capacitor" | "inductor", endTerminationType: "open circuit" | "closed circuit" | "resistor" | "capacitor" | "inductor", timestep: number, transmissionLineSegments: number, transmissionLineResistance: number, transmissionLineConductance: number, transmissionLineInductance: number, transmissionLineCapacitance: number, voltageSourceVoltage: number, voltageSourcePeriod: number, voltageSourcePulseLength: number, terminatingResistance: number, terminatingCapacitance: number, terminatingInductance: number): void {
        let simulationTypeNumber = ["basic"].indexOf(simulationType) + 1;
        let sourceTypeNumber = ["step", "pulse", "sine"].indexOf(sourceType) + 1;
        let startTerminationTypeNumber = ["closed circuit", "resistor", "capacitor", "inductor"].indexOf(startTerminationType) + 1;
        let endTerminationTypeNumber = ["open circuit", "closed circuit", "resistor", "capacitor", "inductor"].indexOf(endTerminationType) + 1;
        //configureSimulator(simulationTypeNumber as 1, sourceTypeNumber as 1 | 2 | 3, terminationTypeNumber as 1 | 2 | 3 | 4 | 5, timestep, transmissionLineSegments, transmissionLineResistance, transmissionLineConductance, transmissionLineInductance, transmissionLineCapacitance, voltageSourceVoltage, voltageSourcePeriod!, voltageSourcePulseLength!, terminatingResistance!, terminatingCapacitance!, terminatingInductance!);
    }

    /**
     * Resets the voltages, currents and current tick to zero.
     */
    public resetSimulation(): void {
        resetSimulation();
    }

    /**
     * Does a single step of the simulation.
     */
    public stepSimulation(): void {
        stepSimulation();
    }

    /** 
     * Gets the current simulation tick.
     */
    public getTick(): number {
        return getTick();
    }

    /**
     * Gets the current simulation time.
     */
    public getTime(): number {
        return getTime();
    }

    /**
     * Gets all the values for voltages.
     */
    public getVoltages(): number[] {
        return Array.from(getVoltages());
    }

    /**
     * Gets all the values for current.
     */
    public getCurrents(): number[] {
        return Array.from(getCurrents());
    }
}