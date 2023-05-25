import { TypescriptSimulator } from "./model/simulator/typescriptSimulator.js";
import { WebAssemblySimulator } from "./model/simulator/webAssemblySimulator.js";
import { ActionButton } from "./view/buttons/general-purpose/actionButton.js";
import { SelectCircuitLayoutButton } from "./view/buttons/specific/circuit-layout/selectCircuitLayoutButton.js";
import { SelectDrivingSubcircuitLayoutButton } from "./view/buttons/specific/circuit-layout/selectDrivingSubCircuitLayoutButton.js";
import { SelectTerminatingSubcircuitLayoutButton } from "./view/buttons/specific/circuit-layout/selectTerminatingSubCircuitLayoutButton.js";
import { SVGDrivingSubcircuit } from "./view/svg/svg-driving-subcircuit/svgDrivingSubcircuit.js";
import { SVGLineGraph } from "./view/svg/svg-line-graph/svgLineGraph.js";
import { SVGTerminatingSubcircuit } from "./view/svg/svg-terminating-subcircuit/svgTerminatingSubcircuit.js";
import { SimulatorSettingsViewModel } from "./viewmodel/settings/simulatorSettingsViewModel.js";
import { NumberArrayDataSource } from "./viewmodel/data-source/numberArrayDataSource.js";
import { SVGStepVoltageSourceComponent } from "./view/svg/svg-circuit-component/svgStepVoltageSourceComponent.js";
import { SVGSineVoltageSourceComponent } from "./view/svg/svg-circuit-component/svgSineVoltageSourceComponent.js";
import { SVGPulseVoltageSourceComponent } from "./view/svg/svg-circuit-component/svgPulseVoltageSourceComponent.js";
import { SVGTransmissionLineComponent } from "./view/svg/svg-circuit-component/transmissionLineComponent.js";
import { SelectStartTerminatingSubcircuitLayoutButton } from "./view/buttons/specific/circuit-layout/selectStartTerminatingSubCircuitLayoutButton.js";
import { SVGStartTerminatingSubcircuit } from "./view/svg/svg-start-terminating-subcircuit/svgStartTerminatingSubcircuit.js";
import { SVGStartResistorComponent } from "./view/svg/svg-circuit-component/startResistorComponent.js";
import { SVGStartCapacitorComponent } from "./view/svg/svg-circuit-component/startCapacitorComponent.js";
import { SVGStartInductorComponent } from "./view/svg/svg-circuit-component/startInductorComponent.js";
import { SVGEndResistorComponent } from "./view/svg/svg-circuit-component/endResistorComponent.js";
import { SVGEndCapacitorComponent } from "./view/svg/svg-circuit-component/endCapacitorComponent.js";
import { SVGEndInductorComponent } from "./view/svg/svg-circuit-component/endInductorComponent.js";

/**
 * This is the main entrypoint into the application. It does a couple of things:
 * - Brings the program into an asyncronous context, so that things can be awaited.
 * - Acts as the constructor injection root: instantiating all of the classes which can be instantiated on startup.
 * - Starts the simulator.
 */

// Call the asyncronous run method without an await to put the program in an asyncronous context
run();

async function run() {
    // Constructor Injection Root - Model - Simulator
    //let simulator = new TypescriptSimulator();
    let simulator = new WebAssemblySimulator();
    await simulator.initialiseSimulator();

    // Constructor Injection Root - ViewModel - Settings
    let simulatorSettingsViewModel = new SimulatorSettingsViewModel(simulator, "basic", "step", "closed circuit", "resistor", 0.000000005, 10000, 0.0025, 0.0000001, 0.00001, 0.000000004, 5, 0.0015, 0.0001, 50, 0.000001, 0.001, 50, 0.000001, 0.001);
    
    // Constructor Injection Root - ViewModel - Data Sources
    let numberArrayDataSourceVoltageSpace = new NumberArrayDataSource(Array.from(new Array(1000)).map(v => 0));
    let numberArrayDataSourceCurrentSpace = new NumberArrayDataSource(Array.from(new Array(1000)).map(c => NaN));
    let numberArrayDataSourceVoltageTime1 = new NumberArrayDataSource(Array.from(new Array(1000)).map(v => 0));
    let numberArrayDataSourceVoltageTime2 = new NumberArrayDataSource(Array.from(new Array(1000)).map(v => 0));
    let numberArrayDataSourceCurrentTime1 = new NumberArrayDataSource(Array.from(new Array(1000)).map(c => NaN));
    let numberArrayDataSourceCurrentTime2 = new NumberArrayDataSource(Array.from(new Array(1000)).map(c => NaN));

    // Constructor Injection Root - View - Top Menus - File Menu
    let newMenuButtonElement = document.getElementById('file-sub-menu-item-new') as HTMLDivElement;
    let newMenuButton = new ActionButton(newMenuButtonElement, () => 'new');
    let openMenuButtonElement = document.getElementById('file-sub-menu-item-open') as HTMLDivElement;
    let openMenuButton = new ActionButton(openMenuButtonElement, () => 'open');
    let saveMenuButtonElement = document.getElementById('file-sub-menu-item-save') as HTMLDivElement;
    let saveMenuButton = new ActionButton(saveMenuButtonElement, () => 'save');
    
    // Constructor Injection Root - View - Top Menus - Circuit Layout Menu
    let selectBasicCircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-circuit-standard') as HTMLDivElement;
    let selectBasicCircuitLayoutMenuButton = new SelectCircuitLayoutButton(selectBasicCircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'basic', '--basic-circuit-visible', ['1', '0']);
    let selectStepDrivingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-driving-subcircuit-step') as HTMLDivElement;
    let selectStepDrivingSubcircuitLayoutMenuButton = new SelectDrivingSubcircuitLayoutButton(selectStepDrivingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'step', '--step-driving-subcircuit-visible', ['1', '0']);
    let selectPulseDrivingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-driving-subcircuit-pulse') as HTMLDivElement;
    let selectPulseDrivingSubcircuitLayoutMenuButton = new SelectDrivingSubcircuitLayoutButton(selectPulseDrivingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'pulse', '--pulse-driving-subcircuit-visible', ['1', '0']);
    let selectSineDrivingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-driving-subcircuit-sine') as HTMLDivElement;
    let selectSineDrivingSubcircuitLayoutMenuButton = new SelectDrivingSubcircuitLayoutButton(selectSineDrivingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'sine', '--sine-driving-subcircuit-visible', ['1', '0']);
    let selectClosedCircuitStartTerminatingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-start-terminating-subcircuit-closed-circuit') as HTMLDivElement;
    let selectClosedCircuitStartTerminatingSubcircuitLayoutMenuButton = new SelectStartTerminatingSubcircuitLayoutButton(selectClosedCircuitStartTerminatingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'closed circuit', '--closed-circuit-terminating-subcircuit-visible', ['1', '0']);
    let selectResistorStartTerminatingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-start-terminating-subcircuit-resistor') as HTMLDivElement;
    let selectResistorStartTerminatingSubcircuitLayoutMenuButton = new SelectStartTerminatingSubcircuitLayoutButton(selectResistorStartTerminatingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'resistor', '--resistor-terminating-subcircuit-visible', ['1', '0']);
    let selectCapacitorStartTerminatingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-start-terminating-subcircuit-capacitor') as HTMLDivElement;
    let selectCapacitorStartTerminatingSubcircuitLayoutMenuButton = new SelectStartTerminatingSubcircuitLayoutButton(selectCapacitorStartTerminatingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'capacitor', '--capacitor-terminating-subcircuit-visible', ['1', '0']);
    let selectInductorStartTerminatingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-start-terminating-subcircuit-inductor') as HTMLDivElement;
    let selectInductorStartTerminatingSubcircuitLayoutMenuButton = new SelectStartTerminatingSubcircuitLayoutButton(selectInductorStartTerminatingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'inductor', '--inductor-terminating-subcircuit-visible', ['1', '0']);
    let selectOpenCircuitTerminatingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-terminating-subcircuit-open-circuit') as HTMLDivElement;
    let selectOpenCircuitTerminatingSubcircuitLayoutMenuButton = new SelectTerminatingSubcircuitLayoutButton(selectOpenCircuitTerminatingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'open circuit', '--open-circuit-terminating-subcircuit-visible', ['1', '0']);
    let selectClosedCircuitTerminatingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-terminating-subcircuit-closed-circuit') as HTMLDivElement;
    let selectClosedCircuitTerminatingSubcircuitLayoutMenuButton = new SelectTerminatingSubcircuitLayoutButton(selectClosedCircuitTerminatingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'closed circuit', '--closed-circuit-terminating-subcircuit-visible', ['1', '0']);
    let selectResistorTerminatingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-terminating-subcircuit-resistor') as HTMLDivElement;
    let selectResistorTerminatingSubcircuitLayoutMenuButton = new SelectTerminatingSubcircuitLayoutButton(selectResistorTerminatingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'resistor', '--resistor-terminating-subcircuit-visible', ['1', '0']);
    let selectCapacitorTerminatingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-terminating-subcircuit-capacitor') as HTMLDivElement;
    let selectCapacitorTerminatingSubcircuitLayoutMenuButton = new SelectTerminatingSubcircuitLayoutButton(selectCapacitorTerminatingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'capacitor', '--capacitor-terminating-subcircuit-visible', ['1', '0']);
    let selectInductorTerminatingSubcircuitLayoutMenuButtonElement = document.getElementById('circuit-layout-sub-menu-item-terminating-subcircuit-inductor') as HTMLDivElement;
    let selectInductorTerminatingSubcircuitLayoutMenuButton = new SelectTerminatingSubcircuitLayoutButton(selectInductorTerminatingSubcircuitLayoutMenuButtonElement, simulatorSettingsViewModel, 'inductor', '--inductor-terminating-subcircuit-visible', ['1', '0']);
    
    // Constructor Injection Root - View - Sidebar
    let selectBasicCircuitLayoutSidebarButtonElement = document.getElementById('basic-circuit-layout-preview-container') as HTMLDivElement;
    let selectBasicCircuitLayoutSidebarButton = new SelectCircuitLayoutButton(selectBasicCircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'basic', '--basic-circuit-visible', ['1', '0']);
    let selectStepDrivingSubcircuitLayoutSidebarButtonElement = document.getElementById('step-driving-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectStepDrivingSubcircuitLayoutSidebarButton = new SelectDrivingSubcircuitLayoutButton(selectStepDrivingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'step', '--step-driving-subcircuit-visible', ['1', '0']);
    let selectPulseDrivingSubcircuitLayoutSidebarButtonElement = document.getElementById('pulse-driving-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectPulseDrivingSubcircuitLayoutSidebarButton = new SelectDrivingSubcircuitLayoutButton(selectPulseDrivingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'pulse', '--pulse-driving-subcircuit-visible', ['1', '0']);
    let selectSineDrivingSubcircuitLayoutSidebarButtonElement = document.getElementById('sine-driving-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectSineDrivingSubcircuitLayoutSidebarButton = new SelectDrivingSubcircuitLayoutButton(selectSineDrivingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'sine', '--sine-driving-subcircuit-visible', ['1', '0']);
    let selectClosedCircuitStartTerminatingSubcircuitLayoutSidebarButtonElement = document.getElementById('closed-circuit-start-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectClosedCircuitStartTerminatingSubcircuitLayoutSidebarButton = new SelectStartTerminatingSubcircuitLayoutButton(selectClosedCircuitStartTerminatingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'closed circuit', '--closed-circuit-start-terminating-subcircuit-visible', ['1', '0']);
    let selectResistorStartTerminatingSubcircuitLayoutSidebarButtonElement = document.getElementById('resistor-start-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectResistorStartTerminatingSubcircuitLayoutSidebarButton = new SelectStartTerminatingSubcircuitLayoutButton(selectResistorStartTerminatingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'resistor', '--resistor-start-terminating-subcircuit-visible', ['1', '0']);
    //let selectCapacitorStartTerminatingSubcircuitLayoutSidebarButtonElement = document.getElementById('capacitor-start-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    //let selectCapacitorStartTerminatingSubcircuitLayoutSidebarButton = new SelectStartTerminatingSubcircuitLayoutButton(selectCapacitorStartTerminatingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'capacitor', '--capacitor-start-terminating-subcircuit-visible', ['1', '0']);
    let selectInductorStartTerminatingSubcircuitLayoutSidebarButtonElement = document.getElementById('inductor-start-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectInductorStartTerminatingSubcircuitLayoutSidebarButton = new SelectStartTerminatingSubcircuitLayoutButton(selectInductorStartTerminatingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'inductor', '--inductor-start-terminating-subcircuit-visible', ['1', '0']);
    let selectOpenCircuitTerminatingSubcircuitLayoutSidebarButtonElement = document.getElementById('open-circuit-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectOpenCircuitTerminatingSubcircuitLayoutSidebarButton = new SelectTerminatingSubcircuitLayoutButton(selectOpenCircuitTerminatingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'open circuit', '--open-circuit-terminating-subcircuit-visible', ['1', '0']);
    let selectClosedCircuitTerminatingSubcircuitLayoutSidebarButtonElement = document.getElementById('closed-circuit-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectClosedCircuitTerminatingSubcircuitLayoutSidebarButton = new SelectTerminatingSubcircuitLayoutButton(selectClosedCircuitTerminatingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'closed circuit', '--closed-circuit-terminating-subcircuit-visible', ['1', '0']);
    let selectResistorTerminatingSubcircuitLayoutSidebarButtonElement = document.getElementById('resistor-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectResistorTerminatingSubcircuitLayoutSidebarButton = new SelectTerminatingSubcircuitLayoutButton(selectResistorTerminatingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'resistor', '--resistor-terminating-subcircuit-visible', ['1', '0']);
    let selectCapacitorTerminatingSubcircuitLayoutSidebarButtonElement = document.getElementById('capacitor-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectCapacitorTerminatingSubcircuitLayoutSidebarButton = new SelectTerminatingSubcircuitLayoutButton(selectCapacitorTerminatingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'capacitor', '--capacitor-terminating-subcircuit-visible', ['1', '0']);
    let selectInductorTerminatingSubcircuitLayoutSidebarButtonElement = document.getElementById('inductor-terminating-subcircuit-layout-preview-container') as HTMLDivElement;
    let selectInductorTerminatingSubcircuitLayoutSidebarButton = new SelectTerminatingSubcircuitLayoutButton(selectInductorTerminatingSubcircuitLayoutSidebarButtonElement, simulatorSettingsViewModel, 'inductor', '--inductor-terminating-subcircuit-visible', ['1', '0']);

    // Constructor Injection Root - View - Circuits and Subcircuits
    let svgStepDrivingSubCircuitElement = document.getElementById('step-driving-subcircuit') as any as SVGGElement;
    let svgStepDrivingSubCircuit = new SVGDrivingSubcircuit(svgStepDrivingSubCircuitElement, 'step', simulatorSettingsViewModel);
    let svgPulseDrivingSubCircuitElement = document.getElementById('pulse-driving-subcircuit') as any as SVGGElement;
    let svgPulseDrivingSubCircuit = new SVGDrivingSubcircuit(svgPulseDrivingSubCircuitElement, 'pulse', simulatorSettingsViewModel);
    let svgSineDrivingSubCircuitElement = document.getElementById('sine-driving-subcircuit') as any as SVGGElement;
    let svgSineDrivingSubCircuit = new SVGDrivingSubcircuit(svgSineDrivingSubCircuitElement, 'sine', simulatorSettingsViewModel);
    let closedCircuitStartTerminatingSubCircuitElement = document.getElementById('closed-circuit-start-terminating-subcircuit') as any as SVGGElement;
    let closedCircuitStartTerminatingSubCircuit = new SVGStartTerminatingSubcircuit(closedCircuitStartTerminatingSubCircuitElement, 'closed circuit', simulatorSettingsViewModel);
    let resistorStartTerminatingSubCircuitElement = document.getElementById('resistor-start-terminating-subcircuit') as any as SVGGElement;
    let resistorStartTerminatingSubCircuit = new SVGStartTerminatingSubcircuit(resistorStartTerminatingSubCircuitElement, 'resistor', simulatorSettingsViewModel);
    let capacitorStartTerminatingSubCircuitElement = document.getElementById('capacitor-start-terminating-subcircuit') as any as SVGGElement;
    let capacitorStartTerminatingSubCircuit = new SVGStartTerminatingSubcircuit(capacitorStartTerminatingSubCircuitElement, 'capacitor', simulatorSettingsViewModel);
    let inductorStartTerminatingSubCircuitElement = document.getElementById('inductor-start-terminating-subcircuit') as any as SVGGElement;
    let inductorStartTerminatingSubCircuit = new SVGStartTerminatingSubcircuit(inductorStartTerminatingSubCircuitElement, 'inductor', simulatorSettingsViewModel);
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
    let svgStartResistorComponentElement = document.getElementById('start-resistor') as any as SVGGElement;
    let svgStartResistorComponent = new SVGStartResistorComponent(svgStartResistorComponentElement, simulatorSettingsViewModel);
    let svgStartCapacitorComponentElement = document.getElementById('start-capacitor') as any as SVGGElement;
    let svgStartCapacitorComponent = new SVGStartCapacitorComponent(svgStartCapacitorComponentElement, simulatorSettingsViewModel);
    let svgStartInductorComponentElement = document.getElementById('start-inductor') as any as SVGGElement;
    let svgStartInductorComponent = new SVGStartInductorComponent(svgStartInductorComponentElement, simulatorSettingsViewModel);
    let svgEndResistorComponentElement = document.getElementById('end-resistor') as any as SVGGElement;
    let svgEndResistorComponent = new SVGEndResistorComponent(svgEndResistorComponentElement, simulatorSettingsViewModel);
    let svgEndCapacitorComponentElement = document.getElementById('end-capacitor') as any as SVGGElement;
    let svgEndCapacitorComponent = new SVGEndCapacitorComponent(svgEndCapacitorComponentElement, simulatorSettingsViewModel);
    let svgEndInductorComponentElement = document.getElementById('end-inductor') as any as SVGGElement;
    let svgEndInductorComponent = new SVGEndInductorComponent(svgEndInductorComponentElement, simulatorSettingsViewModel);
    let svgTransmissionLineComponentElement = document.getElementById('transmission-line') as any as SVGGElement;
    let svgTransmissionLineComponent = new SVGTransmissionLineComponent(svgTransmissionLineComponentElement, simulatorSettingsViewModel);

    // Constructor Injection Root - View - Graphs
    let svgVoltageDistanceLineGraphElement = document.getElementById('voltage-distance-line-graph') as any as SVGPolylineElement;
    let svgVoltageDistanceLineGraph = new SVGLineGraph(svgVoltageDistanceLineGraphElement, numberArrayDataSourceVoltageSpace);
    let svgCurrentDistanceLineGraphElement = document.getElementById('current-distance-line-graph') as any as SVGPolylineElement;
    let svgCurrentDistanceLineGraph = new SVGLineGraph(svgCurrentDistanceLineGraphElement, numberArrayDataSourceCurrentSpace);
    let svgVoltageTimeLineGraph1Element = document.getElementById('voltage-time-line-graph-1') as any as SVGPolylineElement;
    let svgVoltageTimeLineGraph1 = new SVGLineGraph(svgVoltageTimeLineGraph1Element, numberArrayDataSourceVoltageTime1);
    let svgVoltageTimeLineGraph2Element = document.getElementById('voltage-time-line-graph-2') as any as SVGPolylineElement;
    let svgVoltageTimeLineGraph2 = new SVGLineGraph(svgVoltageTimeLineGraph2Element, numberArrayDataSourceVoltageTime2);
    let svgCurrentTimeLineGraph1Element = document.getElementById('current-time-line-graph-1') as any as SVGPolylineElement;
    let svgCurrentTimeLineGraph1 = new SVGLineGraph(svgCurrentTimeLineGraph1Element, numberArrayDataSourceCurrentTime1);
    let svgCurrentTimeLineGraph2Element = document.getElementById('current-time-line-graph-2') as any as SVGPolylineElement;
    let svgCurrentTimeLineGraph2 = new SVGLineGraph(svgCurrentTimeLineGraph2Element, numberArrayDataSourceCurrentTime2);

    // Run simulator
    let startVoltages = Array.from(new Array(1000)).map(v => 0);
    let endVoltages = Array.from(new Array(1000)).map(v => 0);
    let startCurrents = Array.from(new Array(1000)).map(c => 0);
    let endCurrents = Array.from(new Array(1000)).map(c => 0);
    simulator.resetSimulation();
    while (true) {
        simulator.stepSimulation();

        if (simulator.getTick() % 1000 == 0) {
            await new Promise(r => setTimeout(r, 10));
            let voltages = simulator.getVoltages().map(v => v / 10);
            //let currents = simulator.getCurrents().map(c => NaN);

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