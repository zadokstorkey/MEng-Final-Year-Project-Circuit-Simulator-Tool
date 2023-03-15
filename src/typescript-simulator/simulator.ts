const timeStep = 5 * Math.pow(10, -10); // length of time covered by a single simulation tick, the smaller this value is the more accurate the simulation will be
const distanceStep = 1 * Math.pow(10, -1); // distance between calculated points on the transmission line, the smaller this value is the more accurate the simulation will be
const transmissionLineResistanceInOhms = 75 * Math.pow(10, 0); // resistance of line
const transmissionLineConductanceInSiemens  = 1 * Math.pow(10, -6);
const transmissionLineInductanceInHenrys = 175 * Math.pow(10, -6);
const transmissionLineCapacitanceInFarads = 15 * Math.pow(10, -9);
const arraySize = 1000;
const inputVoltageProvider: (time: number) => number = () => 5 * Math.pow(10, 0);

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
    let currentDistanceGradient = (currentOfAheadPoint - currentOfBehindPoint) / (distanceStep * 2); // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let voltageTimeGradient = (- currentDistanceGradient - (transmissionLineConductanceInSiemens * voltageOfThisPoint)) / transmissionLineCapacitanceInFarads; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let changeInVoltage = voltageTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newVoltage = voltageOfThisPoint + changeInVoltage; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newVoltage;
}

function getNextLosslessValueForVoltage(currentOfBehindPoint: number, currentOfAheadPoint: number, voltageOfThisPoint: number): number {
    let currentDistanceGradient = (currentOfAheadPoint - currentOfBehindPoint) / (distanceStep * 2); // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let voltageTimeGradient = (- currentDistanceGradient) / transmissionLineCapacitanceInFarads; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let changeInVoltage = voltageTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newVoltage = voltageOfThisPoint + changeInVoltage; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newVoltage;
}

function getNextValueForVoltageAtEndOfTransmissionLine(currentOfBehindPoint: number, currentOfThisPoint: number, voltageOfThisPoint: number): number {
    let currentDistanceGradient = (currentOfThisPoint - currentOfBehindPoint) / (distanceStep); // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let voltageTimeGradient = (- currentDistanceGradient - (transmissionLineConductanceInSiemens * voltageOfThisPoint)) / transmissionLineCapacitanceInFarads; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let changeInVoltage = voltageTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newVoltage = voltageOfThisPoint + changeInVoltage; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newVoltage;
}

function getNextLosslessValueForVoltageAtEndOfTransmissionLine(currentOfBehindPoint: number, currentOfThisPoint: number, voltageOfThisPoint: number): number {
    let currentDistanceGradient = (currentOfThisPoint - currentOfBehindPoint) / (distanceStep); // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let voltageTimeGradient = (- currentDistanceGradient) / transmissionLineCapacitanceInFarads; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
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
    let voltageDistanceGradient = (voltageOfAheadPoint - voltageOfBehindPoint) / (distanceStep * 2); // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let currentTimeGradient = (- voltageDistanceGradient - (transmissionLineResistanceInOhms * currentOfThisPoint)) / transmissionLineInductanceInHenrys; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let changeInCurrent = currentTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newCurrent = currentOfThisPoint + changeInCurrent; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newCurrent;
}

function getNextLosslessValueForCurrent(voltageOfBehindPoint: number, voltageOfAheadPoint: number, currentOfThisPoint: number): number {
    let voltageDistanceGradient = (voltageOfAheadPoint - voltageOfBehindPoint) / (distanceStep * 2); // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let currentTimeGradient = (- voltageDistanceGradient) / transmissionLineInductanceInHenrys; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let changeInCurrent = currentTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newCurrent = currentOfThisPoint + changeInCurrent; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newCurrent;
}

function getNextValueForCurrentAtStartOfTransmissionLine(voltageOfBehindPoint: number, voltageOfThisPoint: number, currentOfThisPoint: number): number {
    let voltageDistanceGradient = (voltageOfThisPoint - voltageOfBehindPoint) / (distanceStep); // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let currentTimeGradient = (- voltageDistanceGradient - (transmissionLineResistanceInOhms * currentOfThisPoint)) / transmissionLineInductanceInHenrys; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let changeInCurrent = currentTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newCurrent = currentOfThisPoint + changeInCurrent; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newCurrent;
}

function getNextLosslessValueForCurrentAtStartOfTransmissionLine(voltageOfBehindPoint: number, voltageOfThisPoint: number, currentOfThisPoint: number): number {
    let voltageDistanceGradient = (voltageOfThisPoint - voltageOfBehindPoint) / (distanceStep); // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let currentTimeGradient = (- voltageDistanceGradient) / transmissionLineInductanceInHenrys; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let changeInCurrent = currentTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newCurrent = currentOfThisPoint + changeInCurrent; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newCurrent;
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
    let newVoltages = [];
    let newCurrents = [];
    
    ticks++;
    time += timeStep;

    newVoltages.push(inputVoltageProvider(time));
    newCurrents.push(getNextLosslessValueForCurrentAtStartOfTransmissionLine(voltages[0], voltages[0], currents[1]));

    for (let index = 1; index < voltages.length - 1; index++) {
        newVoltages.push(getNextLosslessValueForVoltage(currents[index - 1], currents[index + 1], voltages[index]));
        newCurrents.push(getNextLosslessValueForCurrent(voltages[index - 1], voltages[index + 1], currents[index]));
    }

    newVoltages.push(getNextLosslessValueForVoltageAtEndOfTransmissionLine(currents[arraySize-2], currents[arraySize-1], voltages[arraySize-1]));
    newCurrents.push(0);

    voltages = newVoltages;
    currents = newCurrents;
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

/**
 * Gets the current total amount of simulated elapsed time in seconds.
 * @returns The total amount of simulated elapsed time in seconds.
 */
export function getTime(): number {
    return time;
}

/**
 * Gets the current total number of elapsed ticks.
 * @returns The total number of elapsed ticks.
 */
export function getTicks(): number {
    return ticks;
}