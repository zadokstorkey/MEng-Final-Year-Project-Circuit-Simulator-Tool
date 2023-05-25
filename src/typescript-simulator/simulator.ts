/**
 * 1 = Basic
 */
type ISimulationTypeNumber = 1;

/**
 * 1 = Step Voltage Source, 2 = Pulse Voltage Source, 3 = Sine Voltage Source
 */
type ISourceTypeNumber = 1 | 2 | 3;

/**
 * 1 = Closed Circuit, 2 = Resistor, 3 = Capacitor, 4 = Inductor
 */
type IStartTerminationTypeNumber = 1 | 2 | 3 | 4;

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
let startTerminationType: IStartTerminationTypeNumber;
let endTerminationType: ITerminationTypeNumber;
let timestep: number;
let transmissionLineSegments: number;
let voltageSourceVoltage: number;
let voltageSourcePeriod: number;
let voltageSourcePulseLength: number;
let startTerminatingResistance: number;
let startTerminatingCapacitance: number;
let startTerminatingInductance: number;
let endTerminatingResistance: number;
let endTerminatingCapacitance: number;
let endTerminatingInductance: number;

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
 * @param startTerminationTypeValue The type of termination at the start of the transmission line (1 = Open Circuit, 2 = Closed Circuit, 3 = Resistor, 4 = Capacitor, 5 = Inductor)
 * @param endTerminationTypeValue The type of termination at the end of the transmission line (1 = Closed Circuit, 2 = Resistor, 3 = Capacitor, 4 = Inductor)
 * @param timestepValue How much time a single step reperesents
 * @param transmissionLineResistanceValue The total impedence of the transmission line (not the per unit impedence)
 * @param transmissionLineConductanceValue The total conductance of the transmission line (not the per unit conductance)
 * @param transmissionLineInductanceValue The total inductance of the transmission line (not the per unit inductance)
 * @param transmissionLineCapacitanceValue The total capacitance of the transmission line (not the per unit capacitance)
 * @param transmissionLineSegmentsValue The number of individual positions calculated
 * @param voltageSourceVoltageValue The max voltage of the voltage source
 * @param voltageSourcePeriodValue  The period of the voltage source (affects only to pulse and sine sources)
 * @param voltageSourcePulseLengthValue The length of a pulse of the voltage source (affects only pulse sources)
 * @param startTerminatingResistanceValue The resistance of the terminating resistor (only has an effect if there is a terminating resistor)
 * @param startTerminatingCapacitanceValue The capacitance of the terminating capacitor (only has an effect if there is a terminating capacitor)
 * @param startTerminatingInductanceValue The inductance of the terminating inductor (only has an effect if there is a terminating capacitor)
 * @param endTerminatingResistanceValue The resistance of the terminating resistor (only has an effect if there is a terminating resistor)
 * @param endTerminatingCapacitanceValue The capacitance of the terminating capacitor (only has an effect if there is a terminating capacitor)
 * @param endTerminatingInductanceValue The inductance of the terminating inductor (only has an effect if there is a terminating capacitor)
 */
export function configureSimulator(simulationTypeValue: ISimulationTypeNumber, sourceTypeValue: ISourceTypeNumber, startTerminationTypeValue: IStartTerminationTypeNumber, endTerminationTypeValue: ITerminationTypeNumber, timestepValue: number, transmissionLineSegmentsValue: number, transmissionLineResistanceValue: number, transmissionLineConductanceValue: number, transmissionLineInductanceValue: number, transmissionLineCapacitanceValue: number, voltageSourceVoltageValue: number, voltageSourcePeriodValue: number, voltageSourcePulseLengthValue: number, startTerminatingResistanceValue: number, startTerminatingCapacitanceValue: number, startTerminatingInductanceValue: number, endTerminatingResistanceValue: number, endTerminatingCapacitanceValue: number, endTerminatingInductanceValue: number) {
    let segmentCountChanging = transmissionLineSegments != transmissionLineSegmentsValue;
    
    simulationType = simulationTypeValue;
    sourceType = sourceTypeValue;
    startTerminationType = startTerminationTypeValue;
    endTerminationType = endTerminationTypeValue;
    timestep = timestepValue;
    transmissionLineSegments = transmissionLineSegmentsValue;
    voltageSourceVoltage = voltageSourceVoltageValue;
    voltageSourcePeriod = voltageSourcePeriodValue;
    voltageSourcePulseLength = voltageSourcePulseLengthValue;
    startTerminatingResistance = startTerminatingResistanceValue;
    startTerminatingCapacitance = startTerminatingCapacitanceValue;
    startTerminatingInductance = startTerminatingInductanceValue;
    endTerminatingResistance = endTerminatingResistanceValue;
    endTerminatingCapacitance = endTerminatingCapacitanceValue;
    endTerminatingInductance = endTerminatingInductanceValue;
    
    equationCoefficient1 = (-2 * timestep) / (timestep * transmissionLineConductanceValue + 2 * transmissionLineCapacitanceValue);
    equationCoefficient2 = (2 * transmissionLineCapacitanceValue - timestep * transmissionLineConductanceValue) / (2 * transmissionLineCapacitanceValue + timestep * transmissionLineConductanceValue);
    equationCoefficient3 = (-2 * timestep) / (timestep * transmissionLineResistanceValue + 2 * transmissionLineInductanceValue);
    equationCoefficient4 = (2 * transmissionLineInductanceValue - timestep * transmissionLineResistanceValue) / (2 * transmissionLineInductanceValue + timestep * transmissionLineResistanceValue);

    if (segmentCountChanging) {
        voltages = new Array(transmissionLineSegmentsValue).fill(0);
        currents = new Array(transmissionLineSegmentsValue).fill(0);
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
    if (startTerminationType == 1) {
        // Closed Circuit Start Termination
        voltages[0] = getDrivingSubcircuitVoltage();
    } else if (startTerminationType == 2) {
        // Resistor Start Termination
        voltages[0] = getDrivingSubcircuitVoltage() - currents[0] * startTerminatingResistance;
    } else if (startTerminationType == 3) {
        // Capacitor Start Termination
        voltages[0] = getDrivingSubcircuitVoltage() + (voltages[0] - getDrivingSubcircuitVoltage()) - currents[0] * timestep / startTerminatingCapacitance;
    } else if (startTerminationType == 4) {
        // Inductor Start Termination (graph fix)
        voltages[0] = voltages[1];
    }
    if (endTerminationType == 4) {
        // Capacitor End Termination
        voltages[voltages.length - 1] = voltages[voltages.length - 1] + currents[voltages.length - 2] * timestep / endTerminatingCapacitance;
    }

    // Step the currents
    for (let i = 0; i < voltages.length - 1; i++) {
        currents[i] = equationCoefficient3 * (voltages[i + 1] - voltages[i]) + equationCoefficient4 * currents[i];
    }

    // Handle current boundary conditions
    if (endTerminationType == 1) {
        // Open Circuit End Termination
        currents[voltages.length - 1] = 0;
    } else if (endTerminationType == 2) {
        // Closed Circuit End Termination
        currents[voltages.length - 1] = equationCoefficient3 * (- voltages[voltages.length - 1]) + equationCoefficient4 * currents[voltages.length - 1];
    } else if (endTerminationType == 3) {
        // Resistor End Termination
        currents[voltages.length - 1] = voltages[voltages.length - 1] / endTerminatingResistance;
    } else if (endTerminationType == 4) {
        // Capacitor End Termination (graph fix)
        currents[voltages.length - 1] = currents[voltages.length - 2];
    } else if (endTerminationType == 5) {
        // Inductor End Termination
        currents[voltages.length - 1] = currents[voltages.length - 1] + voltages[voltages.length - 1] * timestep / endTerminatingInductance;
    }
    if (startTerminationType == 4) {
        // Inductor Start Termination
        currents[0] = currents[0] + (getDrivingSubcircuitVoltage() - voltages[1]) * timestep / startTerminatingInductance;
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

function getDrivingSubcircuitVoltage(): number {
    if (sourceType == 1) {
        // Step Voltage Source
        return voltageSourceVoltage;
    } else if (sourceType == 2) {
        // Pulse Voltage Source
        return ((currentTick * timestep) % voltageSourcePeriod) < voltageSourcePulseLength ? voltageSourceVoltage : 0;
    } else if (sourceType == 3) {
        // Sinosoidal Voltage Source
        return voltageSourceVoltage * Math.sin((currentTick * timestep) / voltageSourcePeriod * Math.PI);
    } else {
        throw new Error('Invalid source type!');
    }
}