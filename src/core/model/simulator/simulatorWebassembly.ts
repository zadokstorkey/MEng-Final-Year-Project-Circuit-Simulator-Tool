import { ISimulator } from "./simulatorInterface.js";
import { default as innerInit, resetSimulation as innerResetSimulation, stepSimulation as innerStepSimulation, getVoltages as innerGetVoltages, getCurrents as innerGetCurrents, getTime as innerGetTime, getTicks as innerGetTicks } from "../../../webassembly-simulator/pkg/webassembly_simulator.js";

export class SimulatorWebAssembly implements ISimulator {
    public constructor() {
        
    }

    public async initSimulation(): Promise<void> {
        await innerInit();
        innerResetSimulation();
    }

    public resetSimulation(): void {
        innerResetSimulation();
    }

    public stepSimulation(): void {
        innerStepSimulation();
    }

    public getTicks(): number {
        return innerGetTicks();
    }

    public getTime(): number {
        return innerGetTime();
    }

    public getVoltages(): number[] {
        // Convert from a javascript Float64Array to normal javascript array
        return Array.from(innerGetVoltages());
    }

    public getCurrents(): number[] {
        // Convert from a javascript Float64Array to normal javascript array
        return Array.from(innerGetCurrents());
    }
}