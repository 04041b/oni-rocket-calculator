'use client';

import { useEffect } from "react";

export default function Calculator() {
    useEffect(() => {
        // Load PyScript
        const pyScriptCSS = document.createElement('link');
        pyScriptCSS.rel = 'stylesheet';
        pyScriptCSS.href = 'https://pyscript.net/releases/2024.1.1/core.css';
        document.head.appendChild(pyScriptCSS);

        const pyScriptJS = document.createElement('script');
        pyScriptJS.type = 'module';
        pyScriptJS.src = 'https://pyscript.net/releases/2024.1.1/core.js';
        document.head.appendChild(pyScriptJS);

        return () => {
            // Cleanup
            document.head.removeChild(pyScriptCSS);
            document.head.removeChild(pyScriptJS);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">ONI Rocket Calculator (PyScript)</h1>
                
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Inputs */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rocket Configuration</h2>
                            
                            {/* Fuel Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount of Fuel (kg)
                                </label>
                                <input
                                    type="number"
                                    id="fuel-amount"
                                    defaultValue="1000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                    placeholder="Enter amount of fuel"
                                />
                            </div>

                            {/* Fuel Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fuel Type
                                </label>
                                <select
                                    id="fuel-type"
                                    defaultValue="petroleum"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                >
                                    <option value="steam">Steam (20 km/kg)</option>
                                    <option value="petroleum">Petroleum (40 km/kg)</option>
                                    <option value="liquid_hydrogen">Liquid Hydrogen (60 km/kg)</option>
                                </select>
                            </div>

                            {/* Oxidizer Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Oxidizer Type
                                </label>
                                <select
                                    id="oxidizer-type"
                                    defaultValue="liquid_oxygen"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                >
                                    <option value="oxylite">Oxylite (100% efficiency)</option>
                                    <option value="liquid_oxygen">Liquid Oxygen (133% efficiency)</option>
                                </select>
                            </div>

                            {/* Extra Components */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Extra Modules (Quantity)
                                </label>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700 flex-1">Cargo Bay (2000 kg each)</label>
                                        <input type="number" min="0" defaultValue="0" id="cargo-bay" className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md text-black text-sm" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700 flex-1">Liquid Cargo Bay (2000 kg each)</label>
                                        <input type="number" min="0" defaultValue="0" id="liquid-cargo-bay" className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md text-black text-sm" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700 flex-1">Gas Cargo Bay (2000 kg each)</label>
                                        <input type="number" min="0" defaultValue="0" id="gas-cargo-bay" className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md text-black text-sm" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700 flex-1">Sightseeing (200 kg each)</label>
                                        <input type="number" min="0" defaultValue="0" id="sightseeing" className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md text-black text-sm" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm text-gray-700 flex-1">Research Station (200 kg each)</label>
                                        <input type="number" min="0" defaultValue="0" id="research-station" className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md text-black text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Column - Results */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Results</h2>
                            
                            <div id="results-container" className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Rocket Specifications</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Weight:</span>
                                            <span id="total-weight" className="font-medium text-gray-900">-</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Fuel Tanks Needed:</span>
                                            <span id="fuel-tanks" className="font-medium text-gray-900">-</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Oxidizer Tanks Needed:</span>
                                            <span id="oxidizer-tanks" className="font-medium text-gray-900">-</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-blue-800 mb-2">Performance</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-blue-600">Viable Distance:</span>
                                            <span id="viable-distance" className="font-bold text-blue-900 text-lg">-</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Weight Breakdown</h3>
                                    <div id="weight-breakdown" className="space-y-2 text-sm">
                                        {/* Will be populated by PyScript */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Chart */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Fuel vs Distance Chart</h2>
                            <div id="chart-container" className="bg-gray-50 rounded-lg p-4">
                                <div id="chart" className="w-full h-80 bg-white rounded border">
                                    {/* Chart will be generated by PyScript */}
                                </div>
                                <div className="mt-4 text-sm text-gray-600">
                                    <p>• Blue line shows viable distance</p>
                                    <p>• Current fuel amount is highlighted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PyScript Configuration */}
                <py-config>
                    {`
packages = ["matplotlib", "numpy"]
                    `}
                </py-config>

                {/* PyScript Code */}
                <py-script>
                    {`
import math
from js import document, console, setInterval
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import numpy as np
import base64
import io
from pyodide.ffi import create_proxy

# Constants from the Python calculator
FUEL_EFFICIENCY = {
    "steam": 20,
    "petroleum": 40,
    "liquid_hydrogen": 60
}

OXIDIZER_EFFICIENCY = {
    "oxylite": 1.0,
    "liquid_oxygen": 1.33
}

FUEL_STORAGE_WEIGHT = 100
FUEL_STORAGE_CAPACITY = 900
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
    num_fuel_tanks = math.ceil(fuel_weight / FUEL_STORAGE_CAPACITY)
    num_oxidizer_tanks = math.ceil(fuel_weight / OXIDIZER_STORAGE_CAPACITY)

    fuel_storage_weight = num_fuel_tanks * FUEL_STORAGE_WEIGHT
    oxidizer_storage_weight = num_oxidizer_tanks * OXIDIZER_STORAGE_WEIGHT

    engine_weight = ENGINE_WEIGHT[fuel_type]
    capsule_weight = COMMAND_CAPSULE_WEIGHT

    extra_components_weight = sum(COMPONENT_WEIGHTS[component] * quantity 
                                 for component, quantity in component_quantities.items())

    return (fuel_and_oxidizer_weight + fuel_storage_weight + 
            oxidizer_storage_weight + engine_weight + capsule_weight + extra_components_weight)

def calculate_weight_penalty(ship_weight):
    return max(ship_weight, (ship_weight / 300) ** 3.2)

def calculate_viable_distance(fuel_type, oxidizer_type, ship_weight, amount_fuel):
    penalty = calculate_weight_penalty(ship_weight)
    only_fuel_distance = amount_fuel * FUEL_EFFICIENCY[fuel_type] * OXIDIZER_EFFICIENCY[oxidizer_type]
    return only_fuel_distance - penalty

def get_input_values():
    try:
        fuel_amount = int(document.getElementById("fuel-amount").value or 0)
        fuel_type = document.getElementById("fuel-type").value
        oxidizer_type = document.getElementById("oxidizer-type").value
        
        component_quantities = {
            "cargo_bay": int(document.getElementById("cargo-bay").value or 0),
            "liquid_cargo_bay": int(document.getElementById("liquid-cargo-bay").value or 0),
            "gas_cargo_bay": int(document.getElementById("gas-cargo-bay").value or 0),
            "sightseeing": int(document.getElementById("sightseeing").value or 0),
            "research_station": int(document.getElementById("research-station").value or 0)
        }
        
        return fuel_amount, fuel_type, oxidizer_type, component_quantities
    except Exception as e:
        console.log(f"Error getting input values: {e}")
        return 1000, "petroleum", "liquid_oxygen", {"cargo_bay": 0, "liquid_cargo_bay": 0, "gas_cargo_bay": 0, "sightseeing": 0, "research_station": 0}

def update_results(event=None):
    try:
        fuel_amount, fuel_type, oxidizer_type, component_quantities = get_input_values()
        
        total_weight = calculate_total_weight(fuel_type, fuel_amount, component_quantities)
        viable_distance = calculate_viable_distance(fuel_type, oxidizer_type, total_weight, fuel_amount)
        num_fuel_tanks = math.ceil(fuel_amount / FUEL_STORAGE_CAPACITY)
        num_oxidizer_tanks = math.ceil(fuel_amount / OXIDIZER_STORAGE_CAPACITY)
        
        # Update results in the UI
        document.getElementById("total-weight").innerHTML = f"{total_weight:,} kg"
        document.getElementById("fuel-tanks").innerHTML = str(num_fuel_tanks)
        document.getElementById("oxidizer-tanks").innerHTML = str(num_oxidizer_tanks)
        
        if viable_distance > 0:
            document.getElementById("viable-distance").innerHTML = f"{round(viable_distance):,} km"
        else:
            document.getElementById("viable-distance").innerHTML = "Rocket too heavy to fly"
        
        # Update weight breakdown
        breakdown_html = f"""
            <div class="flex justify-between">
                <span class="text-gray-600">Fuel + Oxidizer:</span>
                <span class="font-medium text-gray-900">{fuel_amount * 2:,} kg</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">Storage Tanks:</span>
                <span class="font-medium text-gray-900">{num_fuel_tanks * FUEL_STORAGE_WEIGHT + num_oxidizer_tanks * OXIDIZER_STORAGE_WEIGHT:,} kg</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">Engine:</span>
                <span class="font-medium text-gray-900">{ENGINE_WEIGHT[fuel_type]} kg</span>
            </div>
            <div class="flex justify-between">
                <span class="text-gray-600">Command Capsule:</span>
                <span class="font-medium text-gray-900">{COMMAND_CAPSULE_WEIGHT} kg</span>
            </div>
        """
        
        extra_weight = sum(COMPONENT_WEIGHTS[component] * quantity 
                          for component, quantity in component_quantities.items())
        if extra_weight > 0:
            breakdown_html += f"""
            <div class="flex justify-between">
                <span class="text-gray-600">Extra Modules:</span>
                <span class="font-medium text-gray-900">{extra_weight:,} kg</span>
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
        
        # Create matplotlib chart
        plt.figure(figsize=(8, 5))
        plt.plot(fuel_range, distances, 'b-', linewidth=2, label='Viable Distance')
        plt.axvline(x=current_fuel, color='g', linestyle='--', linewidth=2, label=f'Current ({current_fuel} kg)')
        
        plt.xlabel('Fuel Amount (kg)')
        plt.ylabel('Distance (km)')
        plt.title('Fuel Amount vs Viable Distance')
        plt.grid(True, alpha=0.3)
        plt.legend()
        
        # Convert plot to base64 image
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight', dpi=100)
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        # Display chart
        chart_html = f'<img src="data:image/png;base64,{image_base64}" class="w-full h-auto">'
        document.getElementById("chart").innerHTML = chart_html
        
    except Exception as e:
        console.log(f"Error generating chart: {e}")
        document.getElementById("chart").innerHTML = f'<div class="text-red-500">Chart error: {e}</div>'

# Add event listeners to all inputs
def setup_listeners():
    try:
        # Create proxy for event handling (moved here to ensure function is defined)
        update_proxy = create_proxy(update_results)
        
        inputs = ["fuel-amount", "fuel-type", "oxidizer-type", "cargo-bay", 
                 "liquid-cargo-bay", "gas-cargo-bay", "sightseeing", "research-station"]
        
        for input_id in inputs:
            element = document.getElementById(input_id)
            if element:
                element.addEventListener("input", update_proxy)
                element.addEventListener("change", update_proxy)
        
        console.log("Event listeners setup complete")
    except Exception as e:
        console.log(f"Error setting up listeners: {e}")

# Initialize
def initialize():
    try:
        setup_listeners()
        update_results()  # Call without event parameter for initial load
        console.log("Calculator initialized successfully")
    except Exception as e:
        console.log(f"Error in initialization: {e}")

# Run initialization
initialize()
                    `}
                </py-script>
            </div>
        </div>
    );
}

