use once_cell::sync::Lazy;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;
use std::f32::consts::PI;

/// All the simulation configuration options
static SIMULATION_SETTINGS: Lazy<Mutex<SimulationSettings>> = Lazy::new(||Mutex::new(SimulationSettings {
    simulation_type: 0i32,
    source_type: 0i32,
    termination_type: 0i32,
    timestep: 0f64,
    transmission_line_segments: 0usize,
    voltage_source_voltage: 0f64,
    voltage_source_period: 0f64,
    voltage_source_pulse_length: 0f64,
    terminating_resistance: 0f64,
    terminating_capacitance: 0f64,
    terminating_inductance: 0f64,
    equation_coefficient_1: 0f64,
    equation_coefficient_2: 0f64,
    equation_coefficient_3: 0f64,
    equation_coefficient_4: 0f64,
    simulator_configured: false
}));

/// Struct for all the simulation configuration options
pub struct SimulationSettings {
    simulation_type: i32,
    source_type: i32,
    termination_type: i32,
    timestep: f64,
    transmission_line_segments: usize,
    voltage_source_voltage: f64,
    voltage_source_period: f64,
    voltage_source_pulse_length: f64,
    terminating_resistance: f64,
    terminating_capacitance: f64,
    terminating_inductance: f64,
    equation_coefficient_1: f64,
    equation_coefficient_2: f64,
    equation_coefficient_3: f64,
    equation_coefficient_4: f64,
    simulator_configured: bool
}

/// Simulation's current state
static SIMULATION_STATE: Lazy<Mutex<SimulationState>> = Lazy::new(||Mutex::new(SimulationState {
    current_tick: 0i32,
    voltages: vec![0.0; 0],
    currents: vec![0.0; 0],
}));

/// Struct for the simulation's current state
pub struct SimulationState {
    current_tick: i32,
    voltages: Vec<f64>,
    currents: Vec<f64>,
}

/// Configure the simulator
#[wasm_bindgen(js_name = "configureSimulator")]
pub fn configure_simulator(simulation_type: i32, source_type: i32, termination_type: i32, timestep: f64, transmission_line_segments: usize, transmission_line_resistance: f64, transmission_line_conductance: f64, transmission_line_inductance: f64, transmission_line_capacitance: f64, voltage_source_voltage: f64, voltage_source_period: f64, voltage_source_pulse_length: f64, terminating_resistance: f64, terminating_capacitance: f64, terminating_inductance: f64) -> () {
    let mut simulation_settings = SIMULATION_SETTINGS.lock().unwrap();
    simulation_settings.simulation_type = simulation_type;
    simulation_settings.source_type = source_type;
    simulation_settings.termination_type = termination_type;
    simulation_settings.timestep = timestep;
    simulation_settings.transmission_line_segments = transmission_line_segments;
    simulation_settings.voltage_source_voltage = voltage_source_voltage;
    simulation_settings.voltage_source_period = voltage_source_period;
    simulation_settings.voltage_source_pulse_length = voltage_source_pulse_length;
    simulation_settings.terminating_resistance = terminating_resistance;
    simulation_settings.terminating_capacitance = terminating_capacitance;
    simulation_settings.terminating_inductance = terminating_inductance;
    simulation_settings.equation_coefficient_1 = (-2f64 * timestep) / (timestep * transmission_line_conductance + 2f64 * transmission_line_capacitance);
    simulation_settings.equation_coefficient_2 = (2f64 * transmission_line_capacitance - timestep * transmission_line_conductance) / (2f64 * transmission_line_capacitance + timestep * transmission_line_conductance);
    simulation_settings.equation_coefficient_3 = (-2f64 * timestep) / (timestep * transmission_line_resistance + 2f64 * transmission_line_inductance);
    simulation_settings.equation_coefficient_4 = (2f64 * transmission_line_inductance - timestep * transmission_line_resistance) / (2f64 * transmission_line_inductance + timestep * transmission_line_resistance);

    let mut simulation_state = SIMULATION_STATE.lock().unwrap();
    simulation_state.voltages = vec![0.0; transmission_line_segments];
    simulation_state.currents = vec![0.0; transmission_line_segments];
}

/// Reset the simulation values for current and voltage
#[wasm_bindgen(js_name = "resetSimulation")]
pub fn reset_simulation() -> () {
    let simulation_settings = SIMULATION_SETTINGS.lock().unwrap();
    let mut simulation_state = SIMULATION_STATE.lock().unwrap();
    simulation_state.current_tick = 0;
    simulation_state.voltages = vec![0.0; simulation_settings.transmission_line_segments];
    simulation_state.currents = vec![0.0; simulation_settings.transmission_line_segments];
}

/// Run a single step of the simulation
#[wasm_bindgen(js_name = "stepSimulation")]
pub fn step_simultion() -> () {
    let simulation_settings = SIMULATION_SETTINGS.lock().unwrap();
    let mut simulation_state = SIMULATION_STATE.lock().unwrap();

    // Step the voltages
    for index in 0..simulation_settings.transmission_line_segments {
        simulation_state.voltages[index] = simulation_settings.equation_coefficient_1 * (simulation_state.currents[index] - simulation_state.currents[index - 1]) + simulation_settings.equation_coefficient_2 * simulation_state.voltages[index];
    }

    // Handle voltage boundary conditions
    if simulation_settings.source_type == 1 {
        simulation_state.voltages[0] = simulation_settings.voltage_source_voltage;
    } else if simulation_settings.source_type == 2 {
        simulation_state.voltages[0] = if (((simulation_state.current_tick as f64) * simulation_settings.timestep) % simulation_settings.voltage_source_period) < simulation_settings.voltage_source_pulse_length {simulation_settings.voltage_source_voltage} else { 0f64 };
    } else if simulation_settings.source_type == 3 {
        simulation_state.voltages[0] = simulation_settings.voltage_source_voltage * (((simulation_state.current_tick as f64) * simulation_settings.timestep) / simulation_settings.voltage_source_period * (PI as f64)).sin();
    }
    if simulation_settings.termination_type == 4 {
        // Capacitor is easier to handle as a voltage boundary condition
        simulation_state.voltages[simulation_settings.transmission_line_segments - 1] = simulation_state.voltages[simulation_settings.transmission_line_segments - 2] - (simulation_state.currents[simulation_settings.transmission_line_segments - 2] * simulation_settings.timestep / (simulation_settings.terminating_capacitance));
    }

    // Step the currents
    for index in 0..simulation_settings.transmission_line_segments {
        simulation_state.currents[index] = simulation_settings.equation_coefficient_3 * (simulation_state.voltages[index] - simulation_state.voltages[index - 1]) + simulation_settings.equation_coefficient_4 * simulation_state.currents[index];
    }
    // Handle current boundary conditions
    if simulation_settings.termination_type == 1 {
        // Open Circuit
        simulation_state.currents[simulation_settings.transmission_line_segments - 1] = 0f64;
    } else if simulation_settings.termination_type == 2 {
        // Closed Circuit
        simulation_state.currents[simulation_settings.transmission_line_segments - 1] = simulation_settings.equation_coefficient_3 * (- simulation_state.voltages[simulation_settings.transmission_line_segments - 1]) + simulation_settings.equation_coefficient_4 * simulation_state.currents[simulation_settings.transmission_line_segments - 1];
    } else if simulation_settings.termination_type == 3 {
        // Resistor
        simulation_state.currents[simulation_settings.transmission_line_segments - 1] = simulation_state.voltages[simulation_settings.transmission_line_segments - 1] / simulation_settings.terminating_resistance;
    } else if simulation_settings.termination_type == 4 {
        // The capacitor is handled as a voltage constraint, this just makes it looks better on the graphs
        simulation_state.currents[simulation_settings.transmission_line_segments - 1] = simulation_state.currents[simulation_settings.transmission_line_segments - 2];
    } else if simulation_settings.termination_type == 5 {
        // Inductor
        simulation_state.currents[simulation_settings.transmission_line_segments - 1] = simulation_state.currents[simulation_settings.transmission_line_segments - 1] - (simulation_state.voltages[simulation_settings.transmission_line_segments - 1] * simulation_settings.timestep / (simulation_settings.terminating_inductance));
    }

    simulation_state.current_tick += 1;
}

/// Get the current simulation tick
#[wasm_bindgen(js_name = "getTick")]
pub fn get_tick() -> i32 {
    let simulation_state = SIMULATION_STATE.lock().unwrap();
    return simulation_state.current_tick;
}

/// Get the current simulation time
#[wasm_bindgen(js_name = "getTime")]
pub fn get_time() -> f64 {
    let simulation_settings = SIMULATION_SETTINGS.lock().unwrap();
    let simulation_state = SIMULATION_STATE.lock().unwrap();
    return (simulation_state.current_tick as f64) * simulation_settings.timestep;
}

/// Get a list of all voltages
#[wasm_bindgen(js_name = "getVoltages")]
pub fn get_voltages() -> Vec<f64> {
    let simulation_state = SIMULATION_STATE.lock().unwrap();
    return simulation_state.voltages.clone();
}

/// Get a list of all currents
#[wasm_bindgen(js_name = "getCurrents")]
pub fn get_currents() -> Vec<f64> {
    let simulation_state = SIMULATION_STATE.lock().unwrap();
    return simulation_state.currents.clone();
}