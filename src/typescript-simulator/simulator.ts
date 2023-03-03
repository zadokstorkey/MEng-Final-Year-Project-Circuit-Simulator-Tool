const timeStep = 5 * Math.pow(10, -15); // length of time covered by a single simulation tick, the smaller this value is the more accurate the simulation will be
const distanceStep = 1 * Math.pow(10, -3); // distance between calculated points on the transmission line, the smaller this value is the more accurate the simulation will be
const transmissionLineResistanceInOhms = 75 * Math.pow(10, 0); // resistance of line
const transmissionLineConductanceInSiemens  = 1 * Math.pow(10, -6);
const transmissionLineInductanceInHenrys = 175 * Math.pow(10, -6);
const transmissionLineCapacitanceInFarads = 15 * Math.pow(10, -9);
const arraySize = 10000;
const inputVoltageProvider: (time: number) => number = () => 5 * Math.pow(10, 0);
const inputCurrentProvider: (time: number) => number = () => 15 * Math.pow(10, -3);

let voltages = new Array(arraySize).fill(0);
let currents = new Array(arraySize).fill(0);
let time = 0;
let ticks = 0;

/**
 * Gets the next voltage at a point.
 * @param currentOfBehindPoint The current value of current at the point one before the one we are calculating.
 * @param currentOfAheadPoint The current value of current at the point one after the one we are calculating.
 * @param voltageOfThisPoint The current value of voltage at the point we are calculating.
 * @returns The next voltage.
 */
function getNextValueForVoltage(currentOfBehindPoint: number, currentOfAheadPoint: number, voltageOfThisPoint: number): number {
    let currentDistanceGradient = (currentOfAheadPoint - currentOfBehindPoint) / distanceStep; // ∂/∂x(I(x, t)) ≈ ΔI / Δx = (I(x + Δx, t) - I(x - Δx, t)) / Δx
    let voltageTimeGradient = (- currentDistanceGradient - (transmissionLineConductanceInSiemens * voltageOfThisPoint)) / transmissionLineCapacitanceInFarads; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let changeInVoltage = voltageTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newVoltage = voltageOfThisPoint + changeInVoltage; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newVoltage;
}

/**
 * Gets the next current at a point.
 * @param voltageOfBehindPoint The current value of voltage at the point before the one we are calculating.
 * @param voltageOfAheadPoint The current value of voltage at the point after the one we are calculating.
 * @param currentOfThisPoint The current value of current at the point we are calculating.
 * @returns The next current.
 */
function getNextValueForCurrent(voltageOfBehindPoint: number, voltageOfAheadPoint: number, currentOfThisPoint: number): number {
    let voltageDistanceGradient = (voltageOfAheadPoint - voltageOfBehindPoint) / distanceStep; // ∂/∂x(I(x, t)) ≈ ΔI / Δx = (I(x + Δx, t) - I(x - Δx, t)) / Δx
    let currentTimeGradient = (- voltageDistanceGradient - (transmissionLineResistanceInOhms * currentOfThisPoint)) / transmissionLineInductanceInHenrys; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let changeInCurrent = currentTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newCurrent = currentOfThisPoint + changeInCurrent; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newCurrent;
}

/**
 * Gets the next set of voltage values for the whole transmission line.
 * @param voltageValues The current values of voltage over the whole transmission line.
 * @param currentValues The current values of current over the whole transmission line.
 * @returns The next values of voltage over the whole transmission line.
 */
function getNextValuesForVoltage(voltageValues: number[], currentValues: number[]): number[] {
    let newVoltageValues = [];
    for (let index = 0; index < voltageValues.length; index++) {
        let behindIndex = index != 0 ? (index - 1) : 0;
        let aheadIndex = index != (voltageValues.length - 1) ? (index + 1) : (voltageValues.length - 1);
        let nextValue = getNextValueForVoltage(currentValues[behindIndex], currentValues[aheadIndex], voltageValues[index]);
        newVoltageValues.push(nextValue);
    }
    return newVoltageValues;
}

/**
 * Gets the next set of current values for the whole transmission line.
 * @param voltageValues The current values of voltage over the whole transmission line.
 * @param currentValues The current values of current over the whole transmission line.
 * @returns The next values of current over the whole transmission line.
 */
function getNextValuesForCurrent(voltageValues: number[], currentValues: number[]): number[] {
    let newCurrentValues = [];
    for (let index = 0; index < voltageValues.length; index++) {
        let behindIndex = index != 0 ? (index - 1) : 0;
        let aheadIndex = index != (voltageValues.length - 1) ? (index + 1) : (voltageValues.length - 1);
        let nextValue = getNextValueForCurrent(voltageValues[behindIndex], voltageValues[aheadIndex], currentValues[index]);
        newCurrentValues.push(nextValue);
    }
    return newCurrentValues;
}

/**
 * Resets the simulation to its initial state.
 */
export function resetSimulation(): void {
    voltages = voltages.map(() => 0);
    currents = currents.map(() => 0);
    ticks = 0;
    time = 0;
}

/**
 * Goes through a single tick of the simulation.
 */
export function stepSimulation(): void {
    ticks++;
    time += timeStep;
    [voltages, currents] = [getNextValuesForVoltage(voltages, currents), getNextValuesForCurrent(voltages, currents)]
    voltages[0] = inputVoltageProvider(time);
    currents[0] = inputCurrentProvider(time);
}

/**
 * Gets the current total number of elapsed ticks.
 * @returns The total number of elapsed ticks.
 */
export function getTicks(): number {
    return ticks;
}

/**
 * Gets the current total amount of simulated elapsed time in seconds.
 * @returns The total amount of simulated elapsed time in seconds.
 */
export function getTime(): number {
    return time;
}

/**
 * Gets the current array of voltages.
 * @returns The array of voltages.
 */ 
export function getVoltages(): number[] {
    return voltages;
}

/**
 * Gets the current array of currents.
 * @returns The array of currents.
 */ 
export function getCurrents(): number[] {
    return currents;
}