import { ISimulator } from "./simulatorInterface.js";
import { resetSimulation as innerResetSimulation, stepSimulation as innerStepSimulation, getTicks as innerGetTicks, getTime as innerGetTime, getVoltages as innerGetVoltages, getCurrents as innerGetCurrents } from "../../../typescript-simulator/simulator.js";

export class SimulatorTypescript implements ISimulator {
    public constructor() {
        
    }

    public async initSimulation(): Promise<void> {
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
        return innerGetVoltages();
    }

    public getCurrents(): number[] {
        return innerGetCurrents();
    }
}