export interface ISimulator { 
    /**
     * Initialises the simulation for the first time.
     */
    initSimulation(): Promise<void>;
    
    /**
     * Resets the simulation to its initial state.
     */
    resetSimulation(): void;

    /**
     * Goes through a single tick of the simulation.
     */
    stepSimulation(): void;
    
    /**
     * Gets the current total number of elapsed ticks.
     * @returns The total number of elapsed ticks.
     */
    getTicks(): number;

    /**
     * Gets the current total amount of simulated elapsed time in seconds.
     * @returns The total amount of simulated elapsed time in seconds.
     */
    getTime(): number;
    
    /**
     * Gets the current array of voltages.
     * @returns The array of voltages.
     */ 
    getVoltages(): number[];
    
    /**
     * Gets the current array of currents.
     * @returns The array of currents.
     */ 
    getCurrents(): number[];
}