/**
 * 1 = Basic
 */
type ISimulationTypeNumber = 1;

/**
 * 1 = Step Voltage Source, 2 = Pulse Voltage Source, 3 = Sine Voltage Source
 */
type ISourceTypeNumber = 1 | 2 | 3;

/**
 * 1 = Open Circuit, 2 = Closed Circuit, 3 = Resistor, 4 = Capacitor, 5 = Inductor
 */
type ITerminationTypeNumber = 1 | 2 | 3 | 4 | 5;

/**
 * Has the simulation been configured yet
 */
let simulationConfigured: boolean = false;

/**
 * Configuration variables
 */
let simulationType: ISimulationTypeNumber;
let sourceType: ISourceTypeNumber;
let terminationType: ITerminationTypeNumber;
let timestep: number;
let transmissionLineSegments: number;
let voltageSourceVoltage: number;
let voltageSourcePeriod: number;
let voltageSourcePulseLength: number;
let terminatingResistance: number;
let terminatingCapacitance: number;
let terminatingInductance: number;

/**
 * Coefficients derived from configuration variables
 */
let equationCoefficient1: number;
let equationCoefficient2: number;
let equationCoefficient3: number;
let equationCoefficient4: number;

/**
 * State variables
 */
let currentTick: number = 0;
let voltages: number[] = [];
let currents: number[] = [];

/**
 * Configure the simulator
 * @param simulationTypeValue The type of simulation (1 = Basic)
 * @param sourceTypeValue The type of source (1 = Step Voltage Source, 2 = Pulse Voltage Source, 3 = Sine Voltage Source)
 * @param terminationTypeValue The type of termination (1 = Open Circuit, 2 = Closed Circuit, 3 = Sine)
 * @param timestepValue How much time a single step reperesents
 * @param transmissionLineResistanceValue The total impedence of the transmission line (not the per unit impedence)
 * @param transmissionLineConductanceValue The total conductance of the transmission line (not the per unit conductance)
 * @param transmissionLineInductanceValue The total inductance of the transmission line (not the per unit inductance)
 * @param transmissionLineCapacitanceValue The total capacitance of the transmission line (not the per unit capacitance)
 * @param transmissionLineSegmentsValue The number of individual positions calculated
 * @param voltageSourceVoltageValue The max voltage of the voltage source
 * @param voltageSourcePeriodValue  The period of the voltage source (affects only to pulse and sine sources)
 * @param voltageSourcePulseLengthValue The length of a pulse of the voltage source (affects only pulse sources)
 * @param terminatingResistanceValue The resistance of the terminating resistor (only has an effect if there is a terminating resistor)
 * @param terminatingCapacitanceValue The capacitance of the terminating capacitor (only has an effect if there is a terminating capacitor)
 * @param terminatingInductanceValue The inductance of the terminating inductor (only has an effect if there is a terminating capacitor)
 */
export function configureSimulator(simulationTypeValue: ISimulationTypeNumber, sourceTypeValue: ISourceTypeNumber, terminationTypeValue: ITerminationTypeNumber, timestepValue: number, transmissionLineSegmentsValue: number, transmissionLineResistanceValue: number, transmissionLineConductanceValue: number, transmissionLineInductanceValue: number, transmissionLineCapacitanceValue: number, voltageSourceVoltageValue: number, voltageSourcePeriodValue: number, voltageSourcePulseLengthValue: number, terminatingResistanceValue: number, terminatingCapacitanceValue: number, terminatingInductanceValue: number) {
    simulationType = simulationTypeValue;
    sourceType = sourceTypeValue;
    terminationType = terminationTypeValue;
    timestep = timestepValue;
    transmissionLineSegments = transmissionLineSegmentsValue;
    voltageSourceVoltage = voltageSourceVoltageValue;
    voltageSourcePeriod = voltageSourcePeriodValue;
    voltageSourcePulseLength = voltageSourcePulseLengthValue;
    terminatingResistance = terminatingResistanceValue;
    terminatingCapacitance = terminatingCapacitanceValue;
    terminatingInductance = terminatingInductanceValue;
    
    equationCoefficient1 = (-2 * timestep) / (timestep * transmissionLineConductanceValue + 2 * transmissionLineCapacitanceValue);
    equationCoefficient2 = (2 * transmissionLineCapacitanceValue - timestep * transmissionLineConductanceValue) / (2 * transmissionLineCapacitanceValue + timestep * transmissionLineConductanceValue);
    equationCoefficient3 = (-2 * timestep) / (timestep * transmissionLineResistanceValue + 2 * transmissionLineInductanceValue);
    equationCoefficient4 = (2 * transmissionLineInductanceValue - timestep * transmissionLineResistanceValue) / (2 * transmissionLineInductanceValue + timestep * transmissionLineResistanceValue);

    while (voltages.length > transmissionLineSegments) {
        voltages.pop();
        currents.pop();
    }
    while (voltages.length < transmissionLineSegments) {
        voltages.push(0);
        currents.push(0);
    }

    simulationConfigured = true;
}

/**
 * Reset the simulation values for current and voltage
 */
export function resetSimulation() {
    currentTick = 0;
    for (let i = 0; i < voltages.length; i++) {
        voltages[i] = 0;
        currents[i] = 0;
    }
}

/**
 * Run a single step of the simulation
 */
export function stepSimulation() {
    // Step the voltages
    for (let i = 1; i < voltages.length; i++) {
        voltages[i] = equationCoefficient1 * (currents[i] - currents[i - 1]) + equationCoefficient2 * voltages[i];
    }

    // Handle voltage boundary conditions
    if (sourceType == 1) {
        voltages[0] = voltageSourceVoltage!;
    } else if (sourceType == 2) {
        voltages[0] = ((currentTick * timestep) % voltageSourcePeriod!) < voltageSourcePulseLength! ? voltageSourceVoltage! : 0;
    } else if (sourceType == 3) {
        voltages[0] = voltageSourceVoltage * Math.sin((currentTick * timestep) / voltageSourcePeriod! * Math.PI);
    }
    if (terminationType == 4) {
        // Capacitor is easier to handle as a voltage boundary condition
        voltages[voltages.length - 1] = voltages[voltages.length - 2] - (currents[voltages.length - 2] * timestep / (terminatingCapacitance!));
    }

    // Step the currents
    for (let i = 0; i < voltages.length - 1; i++) {
        currents[i] = equationCoefficient3 * (voltages[i + 1] - voltages[i]) + equationCoefficient4 * currents[i];
    }

    // Handle current boundary conditions
    if (terminationType == 1) {
        // Open Circuit
        currents[voltages.length - 1] = 0;
    } else if (terminationType == 2) {
        // Closed Circuit
        currents[voltages.length - 1] = equationCoefficient3 * (- voltages[voltages.length - 1]) + equationCoefficient4 * currents[voltages.length - 1];
    } else if (terminationType == 3) {
        // Resistor
        currents[voltages.length - 1] = voltages[voltages.length - 1] / terminatingResistance!;
    } else if (terminationType == 4) {
        // The capacitor is handled as a voltage constraint, this just makes it looks better on the graphs
        currents[voltages.length - 1] = currents[voltages.length - 2];
    } else if (terminationType == 5) {
        // Inductor
        currents[voltages.length - 1] = currents[voltages.length - 1] - (voltages[voltages.length - 1] * timestep / (terminatingInductance!));
    }

    currentTick += 1;
}

/**
 * Get the current simulation tick
 */
export function getTick() {
    return currentTick;
}

/**
 * Get the current simulation time
 */
export function getTime() {
    return currentTick * timestep;
}

/**
 * Get a list of all voltages
 */
export function getVoltages() {
    return voltages;
}

/**
 * Gets a list of all currents
 */
export function getCurrents() {
    return currents;
}