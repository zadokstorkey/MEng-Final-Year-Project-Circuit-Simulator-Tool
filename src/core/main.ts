import { ISimulator } from "./simulation/simulator/simulatorInterface.js";
import { SimulatorTypescript } from "./simulation/simulator/simulatorTypescript.js";
import { SimulatorWebAssembly } from "./simulation/simulator/simulatorWebassembly.js";
import { ActionButton } from "./ui/ui-elements/buttons/actionButton.js";
import { FileMenu } from "./ui/ui-elements/menus/fileMenu.js";
import { Sidebar } from "./ui/ui-elements/panels/sidebar.js";

// Call the asyncronous run method without an await to put the program in an asyncronoius context
run();

async function run() {
    // Constructor Injection Root - Initialise Simulator
    let simulatorTypescript = new SimulatorTypescript();
    let simulatorWebAssembly = new SimulatorWebAssembly();

    // Constructor Injection Root - Initialise UI
    let newButtonElement = document.getElementById('file-sub-menu-item-new') as HTMLElement;
    let newButton = new ActionButton(newButtonElement);
    let openButtonElement = document.getElementById('file-sub-menu-item-open') as HTMLElement;
    let openButton = new ActionButton(openButtonElement);
    let saveButtonElement = document.getElementById('file-sub-menu-item-save') as HTMLElement;
    let saveButton = new ActionButton(saveButtonElement);
    let fileMenuElement = document.getElementById('file-sub-menu') as HTMLDivElement;
    let fileMenu = new FileMenu(fileMenuElement, newButton, openButton, saveButton);
    let sidebarElement = document.getElementById('sidebar') as HTMLDivElement;
    let sidebar = new Sidebar(sidebarElement);

    // Start program (for now just test the simulators)
    runSimulation("Typescript Simulation", simulatorTypescript); // deliberately not awaited
    runSimulation("WebAssembly Simulation", simulatorWebAssembly); // deliberately not awaited
}

async function runSimulation(message: string, simulator: ISimulator) {
    // Reset the simulation
    await simulator.initSimulation();

    // Start the timer
    console.time(message);

    // Run the simulation forever
    for (let tick = 0; true; tick++) {
        // Run one step of the simulation
        simulator.stepSimulation();

        // Every one-hundred-thousanth tick
        if (tick % 100000 == 0 && tick != 0) {
            // Log a message saying how much time has passed and the tick we are on
            console.timeLog(message, "(Tick " + tick + ")");

            // Pause the thread for a moment so that the browser doesn't freeze up
            await new Promise(r => setTimeout(r, 10)); 
        }
    }
}