use std::sync::Mutex;
use once_cell::sync::Lazy;
use wasm_bindgen::prelude::*;

const TIMESTEP: f64 = 0.000000000000005;
const DISTANCESTEP: f64 = 0.001;
const TRANSMISSION_LINE_RESISTANCE_IN_OHMS: f64 = 75.0;
const TRANSMISSION_LINE_CONDUCTANCE_IN_SIEMENS: f64 = 0.000001;
const TRANSMISSION_LINE_INDUCTANCE_IN_HENRYS: f64 = 0.000175;
const TRANSMISSION_LINE_CAPACITANCE_IN_FARADS: f64 = 0.000000015;
const INPUT_VOLTAGE_PROVIDER: fn(f64) -> f64 = |_time| 5.0;
const INPUT_CURRENT_PROVIDER: fn(f64) -> f64 = |_time| 15.0;

static VOLTAGES: Lazy<Mutex<[f64; 10000]>> = Lazy::new(||Mutex::new([0.0; 10000]));
static CURRENTS: Lazy<Mutex<[f64; 10000]>> = Lazy::new(||Mutex::new([0.0; 10000]));
static TIME: Lazy<Mutex<f64>> = Lazy::new(||Mutex::new(0.0));
static TICKS: Lazy<Mutex<i32>> = Lazy::new(||Mutex::new(0));

/// Gets the next value for voltage at a point, calculated from the current currents at the points before and after the point as well as the current voltage at the point.
fn get_next_value_for_voltage(current_of_behind_point: f64, current_of_ahead_point: f64, voltage_of_this_point: f64) -> f64 {
    let current_distance_gradient = (current_of_ahead_point - current_of_behind_point) / DISTANCESTEP; // ∂/∂x(I(x, t)) ≈ ΔI / Δx = (I(x + Δx, t) - I(x - Δx, t)) / Δx
    let voltage_time_gradient = (- current_distance_gradient - (TRANSMISSION_LINE_CONDUCTANCE_IN_SIEMENS * voltage_of_this_point)) / TRANSMISSION_LINE_CAPACITANCE_IN_FARADS; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let change_in_voltage = voltage_time_gradient * TIMESTEP; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let new_voltage = voltage_of_this_point + change_in_voltage; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return new_voltage;
}

/// Gets the next value for current at a point, calculated from the current voltages at the points before and after the point as well as the current current at the point.
fn get_next_value_for_current(voltage_of_behind_point: f64, voltage_of_ahead_point: f64, current_of_this_point: f64) -> f64 {
    let voltage_distance_gradient = (voltage_of_ahead_point - voltage_of_behind_point) / DISTANCESTEP; // ∂/∂x(I(x, t)) ≈ ΔI / Δx = (I(x + Δx, t) - I(x - Δx, t)) / Δx
    let current_time_gradient = (- voltage_distance_gradient - (TRANSMISSION_LINE_RESISTANCE_IN_OHMS * current_of_this_point)) / TRANSMISSION_LINE_INDUCTANCE_IN_HENRYS; // ∂/∂t(V(x, t)) = (- (∂/∂x(I(x, t))) - (G⋅V(x, t))) / C
    let change_in_current = current_time_gradient * TIMESTEP; // ΔV ≈ ∂/∂t(V(x, t)) * Δt
    let new_current = current_of_this_point + change_in_current; // V(x, t + Δt) = V(x, t - Δt) + ΔV
    return new_current;
}

/// Gets the next array of values for the voltage, calculated from the current arrays of voltage and current values.
fn get_next_values_for_voltage(voltage_values: [f64; 10000], current_values: [f64; 10000]) -> [f64; 10000] {
    let mut next_voltage_values = [0.0; 10000];
    for index in 0..10000 {
        let behind_index = if index != 0 {index - 1} else {0};
        let ahead_index = if index != 9999 {index + 1} else {9999};
        let next_value = get_next_value_for_voltage(current_values[behind_index], current_values[ahead_index], voltage_values[index]);
        next_voltage_values[index] = next_value;
    }
    return next_voltage_values;
}

/// Gets the next array of values for the current, calculated from the current arrays of voltage and current values.
fn get_next_values_for_current(voltage_values: [f64; 10000], current_values: [f64; 10000]) -> [f64; 10000] {
    let mut next_current_values = [0.0; 10000];
    for index in 0..10000 {
        let behind_index = if index != 0 {index - 1} else {0};
        let ahead_index = if index != 9999 {index + 1} else {9999};
        let next_value = get_next_value_for_current(voltage_values[behind_index], voltage_values[ahead_index], current_values[index]);
        next_current_values[index] = next_value;
    }
    return next_current_values;
}

/// Resets the simulation to its initial state.
#[wasm_bindgen]
pub fn reset_simulation() -> () {
    *(VOLTAGES.lock().unwrap()) = [0.0; 10000];
    *(CURRENTS.lock().unwrap()) = [0.0; 10000];
    *(TIME.lock().unwrap()) = 0.0;
    *(TICKS.lock().unwrap()) = 0;
}

/// Goes through a single tick of the simulation.
#[wasm_bindgen]
pub fn step_simulation() -> () {
    let current_voltages = *(VOLTAGES.lock().unwrap());
    let current_currents = *(CURRENTS.lock().unwrap());
    let current_time = *(TIME.lock().unwrap());
    let current_ticks = *(TICKS.lock().unwrap());

    let mut next_voltages = get_next_values_for_voltage(current_voltages, current_currents);
    let mut next_currents = get_next_values_for_current(current_voltages, current_currents);
    let next_time = current_time + TIMESTEP;
    let next_ticks = current_ticks + 1;
    next_voltages[0] = INPUT_VOLTAGE_PROVIDER(next_time);
    next_currents[0] = INPUT_CURRENT_PROVIDER(next_time);

    *(VOLTAGES.lock().unwrap()) = next_voltages;
    *(CURRENTS.lock().unwrap()) = next_currents;
    *(TIME.lock().unwrap()) = next_time;
    *(TICKS.lock().unwrap()) = next_ticks;
}

/// Gets the current total number of elapsed ticks.
#[wasm_bindgen]
pub fn get_ticks() -> i32 {
    return *(TICKS.lock().unwrap());
}

/// Gets the current total amount of simulated elapsed time in seconds.
#[wasm_bindgen]
pub fn get_time() -> f64 {
    return *(TIME.lock().unwrap());
}

/// Gets the current array of voltages.
#[wasm_bindgen]
pub fn get_voltages() -> Vec<f64> {
    let voltages = *(VOLTAGES.lock().unwrap());
    return voltages.to_vec();
}

// Gets the current array of currents
#[wasm_bindgen]
pub fn get_currents() -> Vec<f64> {
    let voltages = *(CURRENTS.lock().unwrap());
    return voltages.to_vec();
}