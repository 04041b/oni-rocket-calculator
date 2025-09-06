// Python calculator code for ONI rocket calculations
export const pythonCalculatorCode = `
import math
from js import document, console, setTimeout
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import numpy as np
import base64
import io
from pyodide.ffi import create_proxy

# Fuel efficiency constants (kg fuel per kg rocket for 1 m/s delta-v)
FUEL_EFFICIENCY = {
    "steam": 2.0,
    "petroleum": 3.0,
    "liquid_hydrogen": 8.0
}

# Oxidizer amounts per kg of fuel
OXIDIZER_RATIOS = {
    "steam": 0,
    "petroleum": 2.33,
    "liquid_hydrogen": 5.5
}

# Oxidizer storage weight and capacity
OXIDIZER_STORAGE_WEIGHT = 100
OXIDIZER_STORAGE_CAPACITY = 2700

ENGINE_WEIGHT = {
    "steam": 200,
    "petroleum": 200,
    "liquid_hydrogen": 500
}

COMMAND_CAPSULE_WEIGHT = 200

COMPONENT_WEIGHTS = {
    "cargo_bay": 2000,
    "liquid_cargo_bay": 2000,
    "gas_cargo_bay": 2000,
    "sightseeing": 200,
    "research_station": 200
}

def calculate_total_weight(fuel_type, fuel_weight, component_quantities):
    fuel_and_oxidizer_weight = fuel_weight * 2
    
    oxidizer_needed = fuel_weight * OXIDIZER_RATIOS[fuel_type]
    
    oxidizer_tanks_needed = math.ceil(oxidizer_needed / OXIDIZER_STORAGE_CAPACITY) if oxidizer_needed > 0 else 0
    oxidizer_tank_weight = oxidizer_tanks_needed * OXIDIZER_STORAGE_WEIGHT
    
    engine_weight = ENGINE_WEIGHT[fuel_type]
    
    command_capsule_weight = COMMAND_CAPSULE_WEIGHT
    
    component_weight = sum(COMPONENT_WEIGHTS[component] * quantity for component, quantity in component_quantities.items())
    
    total_weight = fuel_and_oxidizer_weight + oxidizer_tank_weight + engine_weight + command_capsule_weight + component_weight
    
    return total_weight

def calculate_viable_distance(fuel_type, oxidizer_type, total_weight, fuel_weight):
    efficiency = FUEL_EFFICIENCY[fuel_type]
    
    delta_v = (fuel_weight / total_weight) / efficiency
    
    distance = delta_v * 10000
    
    return distance

def update_results(event=None):
    try:
        # Get values from form inputs
        fuel_type = document.getElementById("fuel-type").value
        oxidizer_type = document.getElementById("oxidizer-type").value
        fuel_amount = int(document.getElementById("fuel-amount").value or 0)
        
        # Get component quantities
        component_quantities = {}
        for component in COMPONENT_WEIGHTS.keys():
            element = document.getElementById(f"{component.replace('_', '-')}-quantity")
            if element:
                component_quantities[component] = int(element.value or 0)
        
        # Calculate results
        total_weight = calculate_total_weight(fuel_type, fuel_amount, component_quantities)
        viable_distance = calculate_viable_distance(fuel_type, oxidizer_type, total_weight, fuel_amount)
        
        # Update results display
        document.getElementById("total-weight").innerHTML = f"{total_weight:,.0f} kg"
        document.getElementById("viable-distance").innerHTML = f"{viable_distance:,.0f} km"
        
        # Calculate weight breakdown
        fuel_and_oxidizer_weight = fuel_amount * 2
        oxidizer_needed = fuel_amount * OXIDIZER_RATIOS[fuel_type]
        oxidizer_tanks_needed = math.ceil(oxidizer_needed / OXIDIZER_STORAGE_CAPACITY) if oxidizer_needed > 0 else 0
        oxidizer_tank_weight = oxidizer_tanks_needed * OXIDIZER_STORAGE_WEIGHT
        engine_weight = ENGINE_WEIGHT[fuel_type]
        command_capsule_weight = COMMAND_CAPSULE_WEIGHT
        component_weight = sum(COMPONENT_WEIGHTS[component] * quantity for component, quantity in component_quantities.items())
        
        breakdown_html = f"""
        <div class="grid grid-cols-1 gap-2 text-sm">
            <div class="flex justify-between">
                <span>Fuel + Oxidizer:</span>
                <span>{fuel_and_oxidizer_weight:,.0f} kg</span>
            </div>
            <div class="flex justify-between">
                <span>Oxidizer Tanks ({oxidizer_tanks_needed}):</span>
                <span>{oxidizer_tank_weight:,.0f} kg</span>
            </div>
            <div class="flex justify-between">
                <span>Engine:</span>
                <span>{engine_weight:,.0f} kg</span>
            </div>
            <div class="flex justify-between">
                <span>Command Capsule:</span>
                <span>{command_capsule_weight:,.0f} kg</span>
            </div>
            <div class="flex justify-between">
                <span>Components:</span>
                <span>{component_weight:,.0f} kg</span>
            </div>
            <div class="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>{total_weight:,.0f} kg</span>
            </div>
        </div>
        """
        
        document.getElementById("weight-breakdown").innerHTML = breakdown_html
        
        # Generate chart
        generate_chart(fuel_type, oxidizer_type, component_quantities, fuel_amount)
        
    except Exception as e:
        console.log(f"Error in update_results: {e}")

def generate_chart(fuel_type, oxidizer_type, component_quantities, current_fuel):
    try:
        # Generate data for chart
        fuel_range = list(range(100, 5001, 100))
        distances = []
        
        for fuel in fuel_range:
            weight = calculate_total_weight(fuel_type, fuel, component_quantities)
            distance = calculate_viable_distance(fuel_type, oxidizer_type, weight, fuel)
            distances.append(max(0, distance))
        
        # Call JavaScript function to create chart
        from js import createChart
        createChart(fuel_range, distances, current_fuel)
        
    except Exception as e:
        console.log(f"Error generating chart: {e}")
        document.getElementById("chart").innerHTML = f'<div class="text-red-500 p-4">Chart error: {e}</div>'

def setup_listeners():
    # Create proxy functions for event listeners
    update_proxy = create_proxy(update_results)
    
    # Add event listeners to all form inputs
    inputs = ["fuel-type", "oxidizer-type", "fuel-amount"]
    for input_id in inputs:
        element = document.getElementById(input_id)
        if element:
            element.addEventListener("input", update_proxy)
            element.addEventListener("change", update_proxy)
    
    # Add listeners for component quantities
    for component in COMPONENT_WEIGHTS.keys():
        element_id = f"{component.replace('_', '-')}-quantity"
        element = document.getElementById(element_id)
        if element:
            element.addEventListener("input", update_proxy)
            element.addEventListener("change", update_proxy)

def initialize():
    try:
        setup_listeners()
        update_results()  # Call without event parameter for initial load
        console.log("Calculator initialized successfully")
    except Exception as e:
        console.log(f"Error in initialization: {e}")

# Run initialization
initialize()
`;
