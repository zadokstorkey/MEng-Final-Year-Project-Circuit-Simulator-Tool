import { ISimulator } from "./model/simulator/simulatorInterface.js";
import { SimulatorTypescript } from "./model/simulator/simulatorTypescript.js";
import { SimulatorWebAssembly } from "./model/simulator/simulatorWebassembly.js";
import { ActionButton } from "./view/buttons/actionButton.js";
import { FileMenu } from "./view/menus/fileMenu.js";
import { Sidebar } from "./view/panels/sidebar.js";
import { SVGLineGraph } from "./view/svg/svg-line-graph/svgLineGraph.js";
import { INumberArrayDataSource, NumberArrayDataSource } from "./viewmodel/data-source/numberArrayDataSource.js";

// Call the asyncronous run method without an await to put the program in an asyncronoius context
run();

async function run() {
    // Constructor Injection Root - Initialise Simulator
    let simulatorTypescript = new SimulatorTypescript();
    let simulatorWebAssembly = new SimulatorWebAssembly();

    let numberArrayDataSource = new NumberArrayDataSource(Array.from(new Array(1000)).map(v => 0));

    // Constructor Injection Root - Initialise UI
    let newButtonElement = document.getElementById('file-sub-menu-item-new') as HTMLDivElement;
    let newButton = new ActionButton(newButtonElement);
    let openButtonElement = document.getElementById('file-sub-menu-item-open') as HTMLDivElement;
    let openButton = new ActionButton(openButtonElement);
    let saveButtonElement = document.getElementById('file-sub-menu-item-save') as HTMLDivElement;
    let saveButton = new ActionButton(saveButtonElement);
    let fileMenuElement = document.getElementById('file-sub-menu') as HTMLDivElement;
    let fileMenu = new FileMenu(fileMenuElement, newButton, openButton, saveButton);
    let sidebarElement = document.getElementById('sidebar') as HTMLDivElement;
    let sidebar = new Sidebar(sidebarElement);
    let svgElement = document.getElementById('svgcanvas') as HTMLElement & SVGSVGElement;
    let svgLineGraphElment = svgElement.getElementById('svgpolyline') as SVGPolylineElement;
    let svgLineGraph = new SVGLineGraph(svgLineGraphElment, numberArrayDataSource);

    // Start program (for now just test the simulators)
    runSimulation("Typescript Simulation", simulatorTypescript, numberArrayDataSource); // deliberately not awaited
    //runSimulation("WebAssembly Simulation", simulatorWebAssembly, numberArrayDataSource); // deliberately not awaited
}

let maxVoltageMagnitude = 1

async function runSimulation(message: string, simulator: ISimulator, numberArrayDataSource: INumberArrayDataSource) {
    // Reset the simulation
    await simulator.initSimulation();

    // Start the timer
    console.time(message);

    // Run the simulation forever
    for (let tick = 0; tick <= 100000000; tick++) {
        // Run one step of the simulation
        simulator.stepSimulation();

        // Every one-hundred-thousanth tick
        if (tick % 1000 == 0 && tick != 0) {
            // Log a message saying how much time has passed and the tick we are on
            console.timeLog(message, "(Tick " + tick + ")");

            let voltages = simulator.getVoltages();

            maxVoltageMagnitude = Math.max(maxVoltageMagnitude, Math.max(...voltages), -Math.min(...voltages));

            let normalisedVoltages = voltages.map(v => v / maxVoltageMagnitude);

            numberArrayDataSource.setArrayData(normalisedVoltages);

            return;
            await new Promise(r => setTimeout(r, 1)); 
        }
    }
}