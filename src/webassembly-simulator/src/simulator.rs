use once_cell::sync::Lazy;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;

const ARRAY_SIZE: usize = 1000;
const TIMESTEP: f64 = 0.000000001;
const DISTANCESTEP_DOUBLED: f64 = 0.2;
const TRANSMISSION_LINE_RESISTANCE_IN_OHMS: f64 = 75.0;
const TRANSMISSION_LINE_CONDUCTANCE_IN_SIEMENS: f64 = 0.000001;
const TRANSMISSION_LINE_INDUCTANCE_IN_HENRYS: f64 = 0.000175;
const TRANSMISSION_LINE_CAPACITANCE_IN_FARADS: f64 = 0.000000015;
const INPUT_VOLTAGE_PROVIDER: fn(f64) -> f64 = |_time: f64| 5.0;

static SIMULATION_STATE: Lazy<Mutex<SimulationState>> = Lazy::new(||Mutex::new(SimulationState {
    voltages: vec![0.0; ARRAY_SIZE],
    currents: vec![0.0; ARRAY_SIZE],
    time: 0.0,
    ticks: 0
}));

pub struct SimulationState {
    voltages: Vec<f64>,
    currents: Vec<f64>,
    time: f64,
    ticks: i32
}

/// Gets the next value for voltage at a point, calculated from the current currents at the points before and after the point as well as the current voltage at the point.
fn calculate_next_value_for_voltage(current_of_behind_point: f64, current_of_ahead_point: f64, voltage_of_this_point: f64) -> f64 {
    let current_distance_gradient: f64 = (current_of_ahead_point - current_of_behind_point) / DISTANCESTEP_DOUBLED; // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let voltage_time_gradient: f64 = (- current_distance_gradient - (TRANSMISSION_LINE_CONDUCTANCE_IN_SIEMENS * voltage_of_this_point)) / TRANSMISSION_LINE_CAPACITANCE_IN_FARADS; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let change_in_voltage: f64 = voltage_time_gradient * TIMESTEP; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let new_voltage: f64 = voltage_of_this_point + change_in_voltage; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return new_voltage;
}

fn calculate_next_lossless_value_for_voltage(current_of_behind_point: f64, current_of_ahead_point: f64, voltage_of_this_point: f64) -> f64 {
    let current_distance_gradient: f64 = (current_of_ahead_point - current_of_behind_point) / DISTANCESTEP_DOUBLED; // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let voltage_time_gradient: f64 = (- current_distance_gradient) / TRANSMISSION_LINE_CAPACITANCE_IN_FARADS; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let change_in_voltage: f64 = voltage_time_gradient * TIMESTEP; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let new_voltage: f64 = voltage_of_this_point + change_in_voltage; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return new_voltage;
}

/// Gets the next value for current at a point, calculated from the current voltages at the points before and after the point as well as the current current at the point.
fn calculate_next_value_for_current(voltage_of_behind_point: f64, voltage_of_ahead_point: f64, current_of_this_point: f64) -> f64 {
    let voltage_distance_gradient: f64 = (voltage_of_ahead_point - voltage_of_behind_point) / DISTANCESTEP_DOUBLED; // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let current_time_gradient: f64 = (- voltage_distance_gradient - (TRANSMISSION_LINE_RESISTANCE_IN_OHMS * current_of_this_point)) / TRANSMISSION_LINE_INDUCTANCE_IN_HENRYS; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let change_in_current: f64 = current_time_gradient * TIMESTEP; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let new_current: f64 = current_of_this_point + change_in_current; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return new_current;
}

/// Gets the next value for current at a point, calculated from the current voltages at the points before and after the point as well as the current current at the point.
fn calculate_next_lossless_value_for_current(voltage_of_behind_point: f64, voltage_of_ahead_point: f64, current_of_this_point: f64) -> f64 {
    let voltage_distance_gradient: f64 = (voltage_of_ahead_point - voltage_of_behind_point) / DISTANCESTEP_DOUBLED; // ∂/∂x(I(x, t)) ≈ (I(x + Δx, t) - I(x - Δx, t)) / 2Δx
    let current_time_gradient: f64 = (- voltage_distance_gradient) / TRANSMISSION_LINE_INDUCTANCE_IN_HENRYS; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let change_in_current: f64 = current_time_gradient * TIMESTEP; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let new_current: f64 = current_of_this_point + change_in_current; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return new_current;
}

/// Resets the simulation to its initial state.
#[wasm_bindgen(js_name = "resetSimulation")]
pub fn reset_simulation() -> () {
    let mut simulation_state: std::sync::MutexGuard<SimulationState> = SIMULATION_STATE.lock().unwrap();
    for index in 0..ARRAY_SIZE {
        simulation_state.voltages[index] = 0.0;
        simulation_state.currents[index] = 0.0;
    }
    simulation_state.time = 0.0;
    simulation_state.ticks = 0;
}

/// Goes through a single tick of the simulation. Iterates through all positions on the transmission line and calculates next current and next voltage values for each. Then deals with the start and end points as well as stepping the time.
#[wasm_bindgen(js_name = "stepSimulation")]
pub fn step_simulation() -> () {
    let mut simulation_state: std::sync::MutexGuard<SimulationState> = SIMULATION_STATE.lock().unwrap();
    let mut next_simulation_state: SimulationState = SimulationState {
        voltages: Vec::with_capacity(ARRAY_SIZE),
        currents: Vec::with_capacity(ARRAY_SIZE),
        time: 0.0,
        ticks: 0
    };
    
    next_simulation_state.time = simulation_state.time + TIMESTEP;
    next_simulation_state.ticks = simulation_state.ticks + 1;

    next_simulation_state.voltages.push(INPUT_VOLTAGE_PROVIDER(next_simulation_state.time));
    next_simulation_state.currents.push(calculate_next_lossless_value_for_current(simulation_state.voltages[0], simulation_state.voltages[0], simulation_state.currents[1]));

    for index in 1..(ARRAY_SIZE-1) {
        next_simulation_state.voltages.push(calculate_next_lossless_value_for_voltage(simulation_state.currents[index - 1], simulation_state.currents[index + 1], simulation_state.voltages[index]));
        next_simulation_state.currents.push(calculate_next_lossless_value_for_current(simulation_state.voltages[index - 1], simulation_state.voltages[index + 1], simulation_state.currents[index]));
    }

    next_simulation_state.voltages.push(calculate_next_lossless_value_for_voltage(simulation_state.currents[ARRAY_SIZE-2], simulation_state.currents[ARRAY_SIZE-1], simulation_state.voltages[ARRAY_SIZE-1])); // not currently correct - will fix later
    next_simulation_state.currents.push(0.0); // not currently correct - will fix later

    simulation_state.voltages = next_simulation_state.voltages;
    simulation_state.currents = next_simulation_state.currents;
    simulation_state.time = next_simulation_state.time;
    simulation_state.ticks = next_simulation_state.ticks;
}

/// Gets the current array of voltages.
#[wasm_bindgen(js_name = "getVoltages")]
pub fn get_voltages() -> Vec<f64> {
    let simulation_state: std::sync::MutexGuard<SimulationState> = SIMULATION_STATE.lock().unwrap();
    return simulation_state.voltages.clone();
}

/// Gets the current array of currents.
#[wasm_bindgen(js_name = "getCurrents")]
pub fn get_currents() -> Vec<f64> {
    let simulation_state = SIMULATION_STATE.lock().unwrap();
    return simulation_state.currents.clone();
}

/// Gets the current total amount of simulated elapsed time in seconds.
#[wasm_bindgen(js_name = "getTime")]
pub fn get_time() -> f64 {
    let simulation_state = SIMULATION_STATE.lock().unwrap();
    return simulation_state.time;
}

/// Gets the current total number of elapsed ticks.
#[wasm_bindgen(js_name = "getTicks")]
pub fn get_ticks() -> i32 {
    let simulation_state = SIMULATION_STATE.lock().unwrap();
    return simulation_state.ticks;
}