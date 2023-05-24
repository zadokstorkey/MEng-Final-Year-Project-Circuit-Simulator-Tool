import { TypescriptSimulator } from "./model/simulator/typescriptSimulator.js";
import { WebAssemblySimulator } from "./model/simulator/webAssemblySimulator.js";
import { ActionButton } from "./view/buttons/general-purpose/actionButton.js";
import { SelectCircuitLayoutButton } from "./view/buttons/specific/selectCircuitLayoutButton.js";
import { SelectDrivingSubcircuitLayoutButton } from "./view/buttons/specific/selectDrivingSubCircuitLayoutButton.js";
import { SelectTerminatingSubcircuitLayoutButton } from "./view/buttons/specific/selectTerminatingSubCircuitLayoutButton.js";
import { SVGDrivingSubcircuit } from "./view/svg/svg-driving-subcircuit/svgDrivingSubcircuit.js";
import { SVGLineGraph } from "./view/svg/svg-line-graph/svgLineGraph.js";
import { SVGTerminatingSubcircuit } from "./view/svg/svg-terminating-subcircuit/svgTerminatingSubcircuit.js";
import { SimulatorSettingsViewModel } from "./viewmodel/settings/simulatorSettingsViewModel.js";
import { INumberArrayDataSource, NumberArrayDataSource } from "./viewmodel/data-source/numberArrayDataSource.js";
import { SVGStepVoltageSourceComponent } from "./view/svg/svg-circuit-component/svgStepVoltageSourceComponent.js";
import { SVGSineVoltageSourceComponent } from "./view/svg/svg-circuit-component/svgSineVoltageSourceComponent.js";
import { SVGPulseVoltageSourceComponent } from "./view/svg/svg-circuit-component/svgPulseVoltageSourceComponent.js";
import { SVGResistorComponent } from "./view/svg/svg-circuit-component/resistorComponent.js";
import { SVGCapacitorComponent } from "./view/svg/svg-circuit-component/capacitorComponent.js";
import { SVGInductorComponent } from "./view/svg/svg-circuit-component/inductorComponent.js";
import { SVGTransmissionLineComponent } from "./view/svg/svg-circuit-component/transmissionLineComponent.js";

/**
 * This is the main entrypoint into the application. It does a couple of things:
 * - Brings the program into an asyncronous context, so that things can be awaited.
 * - Acts as the constructor injection root: instantiating all of the classes which can be instantiated on startup.
 * - Starts the simulator.
 */

// Call the asyncronous run method without an await to put the program in an asyncronoius context
run();

async function run() {
    // Constructor Injection Root - Model - Simulator
    let simulator = new TypescriptSimulator();
    //let simulator = new WebAssemblySimulator();

    // Constructor Injection Root - ViewModel - Settings
    let simulatorSettingsViewModel = new SimulatorSettingsViewModel(simulator, "basic", "step", "resistor", 0.000000005, 10000, 0.0025, 0.0000001, 0.00001, 0.000000004, 5, 0.0005, 0.0001, 50, 0.0001, 0.000000001);
    
    // Constructor Injection Root - ViewModel - Data Sources
    let numberArrayDataSourceVoltageSpace = new NumberArrayDataSource(Array.from(new Array(1000)).map(v => 0));
    let numberArrayDataSourceCurrentSpace = new NumberArrayDataSource(Array.from(new Array(1000)).map(c => 0));
    let numberArrayDataSourceVoltageTime1 = new NumberArrayDataSource(Array.from(new Array(1000)).map(v => 0));
    let numberArrayDataSourceVoltageTime2 = new NumberArrayDataSource(Array.from(new Array(1000)).map(v => 0));
    let numberArrayDataSourceCurrentTime1 = new NumberArrayDataSource(Array.from(new Array(1000)).map(c => 0));
    let numberArrayDataSourceCurrentTime2 = new NumberArrayDataSource(Array.from(new Array(1000)).map(c => 0));

    // Constructor Injection Root - View - Top Menus
    let newButtonElement = document.getElementById('file-sub-menu-item-new') as HTMLDivElement;
    let newButton = new ActionButton(newButtonElement, () => 'new');
    let openButtonElement = document.getElementById('file-sub-menu-item-open') as HTMLDivElement;
    let openButton = new ActionButton(openButtonElement, () => 'open');
    let saveButtonElement = document.getElementById('file-sub-menu-item-save') as HTMLDivElement;
    let saveButton = new ActionButton(saveButtonElement, () => 'save');
    
    // Constructor Injection Root - View - Circuit Layout Choice
    let selectBasicCircuitLayoutButtonElement = document.getElementById('basic-circuit-layout-preview-container') as HTMLDivElement;
    let selectBasicCircuitLayoutButton = new SelectCircuitLayoutButton(selectBasicCircuitLayoutButtonElement, simulatorSettingsViewModel, 'basic', '--basic-circuit-visible', ['1', '0']);
    let selectStepDrivingSubcircuitLayoutButtonElement = document.getElementById('step-driving-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectStepDrivingSubcircuitLayoutButton = new SelectDrivingSubcircuitLayoutButton(selectStepDrivingSubcircuitLayoutButtonElement, simulatorSettingsViewModel, 'step', '--step-driving-subcircuit-visible', ['1', '0']);
    let selectPulseDrivingSubcircuitLayoutButtonElement = document.getElementById('pulse-driving-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectPulseDrivingSubcircuitLayoutButton = new SelectDrivingSubcircuitLayoutButton(selectPulseDrivingSubcircuitLayoutButtonElement, simulatorSettingsViewModel, 'pulse', '--pulse-driving-subcircuit-visible', ['1', '0']);
    let selectSineDrivingSubcircuitLayoutButtonElement = document.getElementById('sine-driving-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectSineDrivingSubcircuitLayoutButton = new SelectDrivingSubcircuitLayoutButton(selectSineDrivingSubcircuitLayoutButtonElement, simulatorSettingsViewModel, 'sine', '--sine-driving-subcircuit-visible', ['1', '0']);
    let selectOpenCircuitTerminatingSubcircuitLayoutButtonElement = document.getElementById('open-circuit-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectOpenCircuitTerminatingSubcircuitLayoutButton = new SelectTerminatingSubcircuitLayoutButton(selectOpenCircuitTerminatingSubcircuitLayoutButtonElement, simulatorSettingsViewModel, 'open circuit', '--open-circuit-terminating-subcircuit-visible', ['1', '0']);
    let selectClosedCircuitTerminatingSubcircuitLayoutButtonElement = document.getElementById('closed-circuit-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectClosedCircuitTerminatingSubcircuitLayoutButton = new SelectTerminatingSubcircuitLayoutButton(selectClosedCircuitTerminatingSubcircuitLayoutButtonElement, simulatorSettingsViewModel, 'closed circuit', '--closed-circuit-terminating-subcircuit-visible', ['1', '0']);
    let selectResistorTerminatingSubcircuitLayoutButtonElement = document.getElementById('resistor-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectResistorTerminatingSubcircuitLayoutButton = new SelectTerminatingSubcircuitLayoutButton(selectResistorTerminatingSubcircuitLayoutButtonElement, simulatorSettingsViewModel, 'resistor', '--resistor-terminating-subcircuit-visible', ['1', '0']);
    let selectCapacitorTerminatingSubcircuitLayoutButtonElement = document.getElementById('capacitor-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectCapacitorTerminatingSubcircuitLayoutButton = new SelectTerminatingSubcircuitLayoutButton(selectCapacitorTerminatingSubcircuitLayoutButtonElement, simulatorSettingsViewModel, 'capacitor', '--capacitor-terminating-subcircuit-visible', ['1', '0']);
    let selectInductorTerminatingSubcircuitLayoutButtonElement = document.getElementById('inductor-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectInductorTerminatingSubcircuitLayoutButton = new SelectTerminatingSubcircuitLayoutButton(selectInductorTerminatingSubcircuitLayoutButtonElement, simulatorSettingsViewModel, 'inductor', '--inductor-terminating-subcircuit-visible', ['1', '0']);

    // Constructor Injection Root - View - Circuits and Subcircuits
    let svgStepDrivingSubCircuitElement = document.getElementById('step-driving-subcircuit') as any as SVGGElement;
    let svgStepDrivingSubCircuit = new SVGDrivingSubcircuit(svgStepDrivingSubCircuitElement, 'step', simulatorSettingsViewModel);
    let svgPulseDrivingSubCircuitElement = document.getElementById('pulse-driving-subcircuit') as any as SVGGElement;
    let svgPulseDrivingSubCircuit = new SVGDrivingSubcircuit(svgPulseDrivingSubCircuitElement, 'pulse', simulatorSettingsViewModel);
    let svgSineDrivingSubCircuitElement = document.getElementById('sine-driving-subcircuit') as any as SVGGElement;
    let svgSineDrivingSubCircuit = new SVGDrivingSubcircuit(svgSineDrivingSubCircuitElement, 'sine', simulatorSettingsViewModel);
    let openCircuitTerminatingSubCircuitElement = document.getElementById('open-circuit-terminating-subcircuit') as any as SVGGElement;
    let openCircuitTerminatingSubCircuit = new SVGTerminatingSubcircuit(openCircuitTerminatingSubCircuitElement, 'open circuit', simulatorSettingsViewModel);
    let closedCircuitTerminatingSubCircuitElement = document.getElementById('closed-circuit-terminating-subcircuit') as any as SVGGElement;
    let closedCircuitTerminatingSubCircuit = new SVGTerminatingSubcircuit(closedCircuitTerminatingSubCircuitElement, 'closed circuit', simulatorSettingsViewModel);
    let resistorTerminatingSubCircuitElement = document.getElementById('resistor-terminating-subcircuit') as any as SVGGElement;
    let resistorTerminatingSubCircuit = new SVGTerminatingSubcircuit(resistorTerminatingSubCircuitElement, 'resistor', simulatorSettingsViewModel);
    let capacitorTerminatingSubCircuitElement = document.getElementById('capacitor-terminating-subcircuit') as any as SVGGElement;
    let capacitorTerminatingSubCircuit = new SVGTerminatingSubcircuit(capacitorTerminatingSubCircuitElement, 'capacitor', simulatorSettingsViewModel);
    let inductorTerminatingSubCircuitElement = document.getElementById('inductor-terminating-subcircuit') as any as SVGGElement;
    let inductorTerminatingSubCircuit = new SVGTerminatingSubcircuit(inductorTerminatingSubCircuitElement, 'inductor', simulatorSettingsViewModel);
    
    // Constructor Injection Root - View - Components
    let svgStepVoltageSourceComponentElement = document.getElementById('step-voltage-source') as any as SVGGElement;
    let svgStepVoltageSourceComponent = new SVGStepVoltageSourceComponent(svgStepVoltageSourceComponentElement, simulatorSettingsViewModel);
    let svgSineVoltageSourceComponentElement = document.getElementById('sine-voltage-source') as any as SVGGElement;
    let svgSineVoltageSourceComponent = new SVGSineVoltageSourceComponent(svgSineVoltageSourceComponentElement, simulatorSettingsViewModel);
    let svgPulseVoltageSourceComponentElement = document.getElementById('pulse-voltage-source') as any as SVGGElement;
    let svgPulseVoltageSourceComponent = new SVGPulseVoltageSourceComponent(svgPulseVoltageSourceComponentElement, simulatorSettingsViewModel);
    let svgResistorComponentElement = document.getElementById('resistor') as any as SVGGElement;
    let svgResistorComponent = new SVGResistorComponent(svgResistorComponentElement, simulatorSettingsViewModel);
    let svgCapacitorComponentElement = document.getElementById('capacitor') as any as SVGGElement;
    let svgCapacitorComponent = new SVGCapacitorComponent(svgCapacitorComponentElement, simulatorSettingsViewModel);
    let svgInductorComponentElement = document.getElementById('inductor') as any as SVGGElement;
    let svgInductorComponent = new SVGInductorComponent(svgInductorComponentElement, simulatorSettingsViewModel);
    let svgTransmissionLineComponentElement = document.getElementById('transmission-line') as any as SVGGElement;
    let svgTransmissionLineComponent = new SVGTransmissionLineComponent(svgTransmissionLineComponentElement, simulatorSettingsViewModel);

    // Constructor Injection Root - View - Graphs
    let svgVoltageDistanceLineGraphElement = document.getElementById('voltage-distance-line-graph') as any as SVGPolylineElement;
    let svgVoltageDistanceLineGraph = new SVGLineGraph(svgVoltageDistanceLineGraphElement, numberArrayDataSourceVoltageSpace);
    //let svgCurrentDistanceLineGraphElement = document.getElementById('current-distance-line-graph') as any as SVGPolylineElement;
    //let svgCurrentDistanceLineGraph = new SVGLineGraph(svgCurrentDistanceLineGraphElement, numberArrayDataSourceCurrentSpace);
    let svgVoltageTimeLineGraph1Element = document.getElementById('voltage-time-line-graph-1') as any as SVGPolylineElement;
    let svgVoltageTimeLineGraph1 = new SVGLineGraph(svgVoltageTimeLineGraph1Element, numberArrayDataSourceVoltageTime1);
    let svgVoltageTimeLineGraph2Element = document.getElementById('voltage-time-line-graph-2') as any as SVGPolylineElement;
    let svgVoltageTimeLineGraph2 = new SVGLineGraph(svgVoltageTimeLineGraph2Element, numberArrayDataSourceVoltageTime2);
    //let svgCurrentTimeLineGraph1Element = document.getElementById('current-time-line-graph-1') as any as SVGPolylineElement;
    //let svgCurrentTimeLineGraph1 = new SVGLineGraph(svgCurrentTimeLineGraph1Element, numberArrayDataSourceCurrentTime1);
    //let svgCurrentTimeLineGraph2Element = document.getElementById('current-time-line-graph-2') as any as SVGPolylineElement;
    //let svgCurrentTimeLineGraph2 = new SVGLineGraph(svgCurrentTimeLineGraph2Element, numberArrayDataSourceCurrentTime2);

    // Run simulator
    let startVoltages = Array.from(new Array(1000)).map(v => 0);
    let endVoltages = Array.from(new Array(1000)).map(v => 0);
    let startCurrents = Array.from(new Array(1000)).map(c => 0);
    let endCurrents = Array.from(new Array(1000)).map(c => 0);
    await simulator.initialiseSimulator();
    simulator.resetSimulation();
    while (true) {
        simulator.stepSimulation();
        if (simulator.getTick() % 1000 == 0) {
            await new Promise(r => setTimeout(r, 10));
            let voltages = simulator.getVoltages().map(v => v / 10);
            let currents = simulator.getCurrents().map(c => c);

            numberArrayDataSourceVoltageSpace.setArrayData(voltages);
            //numberArrayDataSourceCurrentSpace.setArrayData(currents);

            startVoltages.pop();
            startVoltages.unshift(voltages[0]);
            endVoltages.pop();
            endVoltages.unshift(voltages[voltages.length - 1]);
            //startCurrents.pop();
            //startCurrents.unshift(currents[0]);
            //endCurrents.pop();
            //endCurrents.unshift(currents[currents.length - 1]);
            numberArrayDataSourceVoltageTime1.setArrayData(startVoltages);
            numberArrayDataSourceVoltageTime2.setArrayData(endVoltages);
            //numberArrayDataSourceCurrentTime1.setArrayData(startCurrents);
            //numberArrayDataSourceCurrentTime2.setArrayData(endCurrents);
        }
    }
}