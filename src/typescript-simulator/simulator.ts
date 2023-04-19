const timeStep = 1 * Math.pow(10, -9); // length of time covered by a single simulation tick, the smaller this value is the more accurate the simulation will be
const distanceStep = 1 * Math.pow(10, -1); // distance between calculated points on the transmission line, the smaller this value is the more accurate the simulation will be
const transmissionLineResistanceInOhms = 75 * Math.pow(10, 0); // resistance of line
const transmissionLineConductanceInSiemens  = 1 * Math.pow(10, -6);
const transmissionLineInductanceInHenrys = 175 * Math.pow(10, -6);
const transmissionLineCapacitanceInFarads = 15 * Math.pow(10, -9);
const arraySize = 1000;
const inputVoltageProvider: (time: number) => number = () => 5 * Math.pow(10, 0);

let forwardsVoltages = new Array(arraySize).fill(0); // Voltages in the forwards direction, ordered from start to end
let backwardsVoltages = new Array(arraySize).fill(0); // Voltages in the backwards direction, ordered from end to start
let forwardsCurrents = new Array(arraySize).fill(0); // Currents in the forwards direction, ordered from start to end
let backwardsCurrents = new Array(arraySize).fill(0); // Currents in the backwards direction, ordered from end to start
let time = 0;
let ticks = 0;

/**
 * Gets the next value for the voltage at a point, taking into account only the signals coming in one direction. This presumes the transmission line is lossless.
 * @param currentOfPreviousPoint The current value of current at the point immediately before the one we are calculating.
 * @param currentOfThisPoint The current value of current at the point we are calculating.
 * @param voltageOfThisPoint The current value of voltage at the point we are calculating.
 * @returns The next value for the voltage at the point we are calculating.
 */
function getNextLosslessValueForVoltage(currentOfPreviousPoint: number, currentOfThisPoint: number, voltageOfThisPoint: number): number {
    let currentDistanceGradient = (currentOfThisPoint - currentOfPreviousPoint) / (distanceStep); // ∂/∂x(I(x, t)) ≈ (I(x, t) - I(x - Δx, t)) / Δx
    let voltageTimeGradient = (- currentDistanceGradient) / transmissionLineCapacitanceInFarads; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (V(x, t))) / C
    let changeInVoltage = voltageTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newVoltage = voltageOfThisPoint + changeInVoltage; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newVoltage;
}

/**
 * Gets the next value for the current at a point, taking into account only the signals coming in one direction. This presumes the transmission line is lossless.
 * @param currentOfPreviousPoint The current value of current at the point immediately before the one we are calculating.
 * @param currentOfThisPoint The current value of current at the point we are calculating.
 * @param voltageOfThisPoint The current value of voltage at the point we are calculating.
 * @returns The next value for the voltage at the point we are calculating.
 */
function getNextLosslessValueForCurrent(voltageOfPreviousPoint: number, voltageOfThisPoint: number, currentOfThisPoint: number): number {
    let voltageDistanceGradient = (voltageOfThisPoint - voltageOfPreviousPoint) / (distanceStep); // ∂/∂x(V(x, t)) ≈ (V(x, t) - V(x - Δx, t)) / Δx
    let currentTimeGradient = (- voltageDistanceGradient) / transmissionLineInductanceInHenrys; // ∂/∂t(I(x, t)) = (- (∂/∂x(V(x, t))) - (I(x, t))) / L
    let changeInCurrent = currentTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newCurrent = currentOfThisPoint + changeInCurrent; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    console.log('voltageDistanceGradient = ', voltageDistanceGradient < 0 ? 'negative' : 'positive', 'currentTimeGradient = ', currentTimeGradient < 0 ? 'negative' : 'positive', 'changeInCurrent = ', changeInCurrent < 0 ? 'negative' : 'positive')
    return newCurrent;
}

function getNextLosslessValueForVoltageAtEnd(currentOfPreviousPoint: number, currentOfThisPoint: number, voltageOfPreviousPoint: number, nextVoltageOfPreviousPoint: number, voltageOfThisPoint: number): number {
    let currentDistanceGradient = (currentOfThisPoint - currentOfPreviousPoint) / (distanceStep); // ∂/∂x(I(x, t)) ≈ (I(x, t) - I(x - Δx, t)) / Δx
    let voltageTimeGradient = (- currentDistanceGradient) / transmissionLineCapacitanceInFarads; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (V(x, t))) / C
    let averageChangeInVoltage = voltageTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let changeInVoltage = averageChangeInVoltage * 2 - (nextVoltageOfPreviousPoint - voltageOfPreviousPoint);
    let newVoltage = voltageOfThisPoint + changeInVoltage; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newVoltage;
}

function getNextLosslessValueForCurrentAtEnd(voltageOfPreviousPoint: number, voltageOfThisPoint: number, currentOfPreviousPoint: number, nextCurrentOfPreviousPoint: number, currentOfThisPoint: number): number {
    let voltageDistanceGradient = (voltageOfThisPoint - voltageOfPreviousPoint) / (distanceStep); // ∂/∂x(V(x, t)) ≈ (V(x, t) - V(x - Δx, t)) / Δx
    let currentTimeGradient = (- voltageDistanceGradient) / transmissionLineInductanceInHenrys; // ∂/∂t(I(x, t)) = (- (∂/∂x(V(x, t))) - (I(x, t))) / L
    let averageChangeInCurrent = currentTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let changeInCurrent = averageChangeInCurrent * 2 - (nextCurrentOfPreviousPoint - currentOfPreviousPoint);
    let newCurrent = currentOfThisPoint + changeInCurrent; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newCurrent;
}

function betterGetNextLosslessValueForVoltage(vt0x0: number, vt0x1: number, vt1x0: number, it0x0: number, it0x1: number, it1x0: number): number {
    let step1 = timeStep * (it0x1 - it1x0 - it0x0);
    let step2 = distanceStep * (vt1x0 - vt0x1 - vt0x0) * transmissionLineCapacitanceInFarads;
    let step3 = step1 + step2;
    let step4 = step3 * (timeStep - (distanceStep * transmissionLineInductanceInHenrys));
    let step5 = (timeStep * timeStep) + (transmissionLineCapacitanceInFarads * step3);
    let vt1x1 = step4 / step5;
    console.log('step1', step1, 'step2', step2, 'step3', step3, 'step4', step4, 'step5', step5, 'answer', vt1x1)
    return vt1x1;
}

function betterGetNextLosslessValueForCurrent(vt0x0: number, vt0x1: number, vt1x0: number, it0x0: number, it0x1: number, it1x0: number): number {
    let step1 = timeStep * (vt0x1 - vt1x0 - vt0x0);
    let step2 = distanceStep * (it1x0 - it0x1 - it0x0) * transmissionLineInductanceInHenrys;
    let step3 = step1 + step2;
    let step4 = step3 * (timeStep - (distanceStep * transmissionLineCapacitanceInFarads));
    let step5 = (timeStep * timeStep) + (transmissionLineInductanceInHenrys * step3);
    let it1x1 = step4 / step5;
    return it1x1;
}

function evenBetterGetNextLosslessValueForVoltage(currentOfBehindPoint: number, currentOfAheadPoint: number, voltageOfThisPoint: number): number {
    let currentDistanceGradient = (currentOfAheadPoint - currentOfBehindPoint) / (distanceStep * 2); // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let voltageTimeGradient = (- currentDistanceGradient) / transmissionLineCapacitanceInFarads; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (V(x, t))) / C
    let changeInVoltage = voltageTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newVoltage = voltageOfThisPoint + changeInVoltage; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newVoltage;
}

function evenBetterGetNextLosslessValueForCurrent(voltageOfBehindPoint: number, voltageOfAheadPoint: number, currentOfThisPoint: number): number {
    let voltageDistanceGradient = (voltageOfAheadPoint - voltageOfBehindPoint) / (distanceStep * 2); // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let currentTimeGradient = (- voltageDistanceGradient) / transmissionLineInductanceInHenrys; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (V(x, t))) / C
    let changeInCurrent = currentTimeGradient * timeStep; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let newCurrent = currentOfThisPoint + changeInCurrent; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return newCurrent;
}


/**
 * Resets the simulation to its initial state.
 */
export function resetSimulation(): void {
    forwardsVoltages = forwardsVoltages.map(() => 0);
    backwardsVoltages = forwardsVoltages.map(() => 0);
    forwardsCurrents = forwardsCurrents.map(() => 0);
    backwardsCurrents = forwardsVoltages.map(() => 0);
    ticks = 0;
    time = 0;
}

/**
 * Goes through a single tick of the simulation.
 */
export function stepSimulation(): void {
    let newForwardsVoltages = [];
    let newBackwardsVoltages = [];
    let newForwardsCurrents = [];
    let newBackwardsCurrents = [];
    
    ticks++;
    time += timeStep;

    newForwardsVoltages.push(inputVoltageProvider(time) - backwardsVoltages[arraySize-1]);
    newForwardsCurrents.push(inputVoltageProvider(time) / transmissionLineResistanceInOhms);
    newBackwardsVoltages.push(forwardsVoltages[arraySize - 1]);
    newBackwardsCurrents.push(forwardsCurrents[arraySize - 1]);

    for (let index = 1; index < forwardsVoltages.length; index++) {
        newForwardsVoltages.push(getNextLosslessValueForVoltage(forwardsCurrents[index - 1], forwardsCurrents[index], forwardsVoltages[index]));
        newBackwardsVoltages.push(getNextLosslessValueForVoltage(backwardsCurrents[index - 1], backwardsCurrents[index], backwardsVoltages[index]));
        newForwardsCurrents.push(getNextLosslessValueForCurrent(forwardsVoltages[index - 1], forwardsVoltages[index], forwardsCurrents[index]));
        newBackwardsCurrents.push(getNextLosslessValueForCurrent(backwardsVoltages[index - 1], backwardsVoltages[index], backwardsCurrents[index]));
        
        //newForwardsVoltages.push(betterGetNextLosslessValueForVoltage(forwardsVoltages[index - 1], forwardsVoltages[index], newForwardsVoltages[index - 1], forwardsCurrents[index - 1], forwardsCurrents[index], newForwardsCurrents[index - 1]));
        //newForwardsCurrents.push(betterGetNextLosslessValueForCurrent(forwardsVoltages[index - 1], forwardsVoltages[index], newForwardsVoltages[index - 1], forwardsCurrents[index - 1], forwardsCurrents[index], newForwardsCurrents[index - 1]));
        //newBackwardsVoltages.push(betterGetNextLosslessValueForVoltage(backwardsVoltages[index - 1], backwardsVoltages[index], newBackwardsVoltages[index - 1], backwardsCurrents[index - 1], backwardsCurrents[index], newBackwardsCurrents[index - 1]));
        //newBackwardsCurrents.push(betterGetNextLosslessValueForCurrent(backwardsVoltages[index - 1], backwardsVoltages[index], newBackwardsVoltages[index - 1], backwardsCurrents[index - 1], backwardsCurrents[index], newBackwardsCurrents[index - 1]));

        //newForwardsVoltages.push(evenBetterGetNextLosslessValueForVoltage(forwardsCurrents[index - 1], forwardsCurrents[index + 1], forwardsVoltages[index]));
        //newBackwardsVoltages.push(evenBetterGetNextLosslessValueForVoltage(backwardsCurrents[index - 1], backwardsCurrents[index + 1], backwardsVoltages[index]));
        //newForwardsCurrents.push(evenBetterGetNextLosslessValueForVoltage(forwardsVoltages[index - 1], forwardsVoltages[index + 1], forwardsCurrents[index]));
        //newBackwardsCurrents.push(evenBetterGetNextLosslessValueForVoltage(backwardsVoltages[index - 1], backwardsVoltages[index + 1], backwardsCurrents[index]));
    }

    newForwardsVoltages.push(getNextLosslessValueForVoltageAtEnd(forwardsCurrents[arraySize - 1], forwardsCurrents[arraySize - 1], forwardsVoltages[arraySize - 2], newForwardsVoltages[arraySize - 2], forwardsVoltages[arraySize - 1]));
    newBackwardsVoltages.push(getNextLosslessValueForVoltageAtEnd(backwardsCurrents[arraySize - 1], backwardsCurrents[arraySize - 1], backwardsVoltages[arraySize - 2], newBackwardsVoltages[arraySize - 2], backwardsVoltages[arraySize - 1]));
    newForwardsCurrents.push(getNextLosslessValueForCurrentAtEnd(forwardsVoltages[arraySize - 1], forwardsVoltages[arraySize - 1], forwardsCurrents[arraySize - 2], newForwardsCurrents[arraySize - 2], forwardsCurrents[arraySize - 1]));
    newBackwardsCurrents.push(getNextLosslessValueForCurrentAtEnd(backwardsVoltages[arraySize - 1], backwardsVoltages[arraySize - 1], backwardsCurrents[arraySize - 2], newBackwardsCurrents[arraySize - 2], backwardsCurrents[arraySize - 1]));

    forwardsVoltages = newForwardsVoltages;
    forwardsCurrents = newForwardsCurrents;
    backwardsVoltages = newBackwardsVoltages;
    backwardsCurrents = newBackwardsCurrents;

    console.log(forwardsVoltages, forwardsCurrents, backwardsVoltages, backwardsCurrents);
}

/**
 * Gets the current array of voltages.
 * @returns The array of voltages.
 */ 
export function getVoltages(): number[] {
    // Combine the forwards and backwards voltages
    return forwardsVoltages.map((forwardsVoltage, index) => forwardsVoltage + backwardsVoltages[arraySize - 1 - index]);
}

/**
 * Gets the current array of currents.
 * @returns The array of currents.
 */ 
export function getCurrents(): number[] {
    return forwardsCurrents.map((forwardsCurrent, index) => forwardsCurrent - backwardsCurrents[arraySize - 1 - index]);
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