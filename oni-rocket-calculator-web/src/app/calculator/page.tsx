'use client';

import { useState, useEffect } from "react";

// Constants from the Python calculator
const FUEL_EFFICIENCY = {
    "steam": 20,
    "petroleum": 40,
    "liquid_hydrogen": 60
};

const OXIDIZER_EFFICIENCY = {
    "oxylite": 1.0,
    "liquid_oxygen": 1.33
};

const FUEL_STORAGE_WEIGHT = 100;
const FUEL_STORAGE_CAPACITY = 900;
const OXIDIZER_STORAGE_WEIGHT = 100;
const OXIDIZER_STORAGE_CAPACITY = 2700;

const ENGINE_WEIGHT = {
    "steam": 200,
    "petroleum": 200,
    "liquid_hydrogen": 500
};

const COMMAND_CAPSULE_WEIGHT = 200;

const COMPONENT_WEIGHTS = {
    "cargo_bay": 2000,
    "liquid_cargo_bay": 2000,
    "gas_cargo_bay": 2000,
    "sightseeing": 200,
    "research_station": 200
};

function calculateTotalWeight(fuelType: string, fuelWeight: number, componentQuantities: {[key: string]: number}) {
    const fuelAndOxidizerWeight = fuelWeight * 2;
    const numFuelTanks = Math.ceil(fuelWeight / FUEL_STORAGE_CAPACITY);
    const numOxidizerTanks = Math.ceil(fuelWeight / OXIDIZER_STORAGE_CAPACITY);

    const fuelStorageWeight = numFuelTanks * FUEL_STORAGE_WEIGHT;
    const oxidizerStorageWeight = numOxidizerTanks * OXIDIZER_STORAGE_WEIGHT;

    const engineWeight = ENGINE_WEIGHT[fuelType as keyof typeof ENGINE_WEIGHT];
    const capsuleWeight = COMMAND_CAPSULE_WEIGHT;

    const extraComponentsWeight = Object.entries(componentQuantities).reduce((sum, [component, quantity]) => 
        sum + (COMPONENT_WEIGHTS[component as keyof typeof COMPONENT_WEIGHTS] * quantity), 0);

    return fuelAndOxidizerWeight + fuelStorageWeight + oxidizerStorageWeight + 
           engineWeight + capsuleWeight + extraComponentsWeight;
}

function calculateWeightPenalty(shipWeight: number) {
    return Math.max(shipWeight, Math.pow(shipWeight / 300, 3.2));
}

function calculateViableDistance(fuelType: string, oxidizerType: string, shipWeight: number, amountFuel: number) {
    const penalty = calculateWeightPenalty(shipWeight);
    const onlyFuelDistance = amountFuel * 
        FUEL_EFFICIENCY[fuelType as keyof typeof FUEL_EFFICIENCY] * 
        OXIDIZER_EFFICIENCY[oxidizerType as keyof typeof OXIDIZER_EFFICIENCY];
    return onlyFuelDistance - penalty;
}

export default function Calculator() {
    const [fuelAmount, setFuelAmount] = useState(1000);
    const [fuelType, setFuelType] = useState("petroleum");
    const [oxidizerType, setOxidizerType] = useState("liquid_oxygen");
    const [componentQuantities, setComponentQuantities] = useState<{[key: string]: number}>({
        "cargo_bay": 0,
        "liquid_cargo_bay": 0,
        "gas_cargo_bay": 0,
        "sightseeing": 0,
        "research_station": 0
    });
    const [results, setResults] = useState<{
        totalWeight: number;
        viableDistance: number;
        numFuelTanks: number;
        numOxidizerTanks: number;
    } | null>(null);

    const handleComponentQuantityChange = (component: string, quantity: number) => {
        setComponentQuantities({
            ...componentQuantities,
            [component]: Math.max(0, quantity) // Ensure non-negative values
        });
    };

    // Real-time calculation effect
    useEffect(() => {
        const totalWeight = calculateTotalWeight(fuelType, fuelAmount, componentQuantities);
        const viableDistance = calculateViableDistance(fuelType, oxidizerType, totalWeight, fuelAmount);
        const numFuelTanks = Math.ceil(fuelAmount / FUEL_STORAGE_CAPACITY);
        const numOxidizerTanks = Math.ceil(fuelAmount / OXIDIZER_STORAGE_CAPACITY);

        setResults({
            totalWeight,
            viableDistance,
            numFuelTanks,
            numOxidizerTanks
        });
    }, [fuelAmount, fuelType, oxidizerType, componentQuantities]); // Recalculate when any input changes

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">ONI Rocket Calculator</h1>
                
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    value={fuelAmount}
                                    onChange={(e) => setFuelAmount(parseInt(e.target.value) || 0)}
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
                                    value={fuelType}
                                    onChange={(e) => setFuelType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                >
                                    <option value="steam">Steam ({FUEL_EFFICIENCY.steam} km/kg)</option>
                                    <option value="petroleum">Petroleum ({FUEL_EFFICIENCY.petroleum} km/kg)</option>
                                    <option value="liquid_hydrogen">Liquid Hydrogen ({FUEL_EFFICIENCY.liquid_hydrogen} km/kg)</option>
                                </select>
                            </div>

                            {/* Oxidizer Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Oxidizer Type
                                </label>
                                <select
                                    value={oxidizerType}
                                    onChange={(e) => setOxidizerType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                                >
                                    <option value="oxylite">Oxylite ({(OXIDIZER_EFFICIENCY.oxylite * 100)}% efficiency)</option>
                                    <option value="liquid_oxygen">Liquid Oxygen ({(OXIDIZER_EFFICIENCY.liquid_oxygen * 100)}% efficiency)</option>
                                </select>
                            </div>

                            {/* Extra Components */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Extra Modules (Quantity)
                                </label>
                                <div className="space-y-3">
                                    {Object.entries(COMPONENT_WEIGHTS).map(([component, weight]) => (
                                        <div key={component} className="flex items-center justify-between">
                                            <label className="text-sm text-gray-700 flex-1">
                                                {component.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} ({weight} kg each)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={componentQuantities[component]}
                                                onChange={(e) => handleComponentQuantityChange(component, parseInt(e.target.value) || 0)}
                                                className="w-20 px-2 py-1 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Results */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Results</h2>
                            
                            {results && (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Rocket Specifications</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Weight:</span>
                                                <span className="font-medium text-gray-900">{results.totalWeight.toLocaleString()} kg</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Fuel Tanks Needed:</span>
                                                <span className="font-medium text-gray-900">{results.numFuelTanks}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Oxidizer Tanks Needed:</span>
                                                <span className="font-medium text-gray-900">{results.numOxidizerTanks}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-blue-800 mb-2">Performance</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-blue-600">Viable Distance:</span>
                                                <span className="font-bold text-blue-900 text-lg">
                                                    {results.viableDistance > 0 
                                                        ? `${Math.round(results.viableDistance).toLocaleString()} km`
                                                        : "Rocket too heavy to fly"
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Weight Breakdown</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Fuel + Oxidizer:</span>
                                                <span className="font-medium text-gray-900">{(fuelAmount * 2).toLocaleString()} kg</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Storage Tanks:</span>
                                                <span className="font-medium text-gray-900">
                                                    {(results.numFuelTanks * FUEL_STORAGE_WEIGHT + results.numOxidizerTanks * OXIDIZER_STORAGE_WEIGHT).toLocaleString()} kg
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Engine:</span>
                                                <span className="font-medium text-gray-900">
                                                    {ENGINE_WEIGHT[fuelType as keyof typeof ENGINE_WEIGHT]} kg
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Command Capsule:</span>
                                                <span className="font-medium text-gray-900">{COMMAND_CAPSULE_WEIGHT} kg</span>
                                            </div>
                                            {Object.entries(componentQuantities).some(([, quantity]) => quantity > 0) && (
                                                <div>
                                                    <div className="flex justify-between font-medium">
                                                        <span className="text-gray-600">Extra Modules:</span>
                                                        <span className="text-gray-900">
                                                            {Object.entries(componentQuantities).reduce((sum: number, [component, quantity]) => 
                                                                sum + (COMPONENT_WEIGHTS[component as keyof typeof COMPONENT_WEIGHTS] * quantity), 0
                                                            ).toLocaleString()} kg
                                                        </span>
                                                    </div>
                                                    <div className="ml-4 mt-1 space-y-1">
                                                        {Object.entries(componentQuantities).map(([component, quantity]) => 
                                                            quantity > 0 && (
                                                                <div key={component} className="flex justify-between text-xs text-gray-500">
                                                                    <span>
                                                                        {quantity}x {component.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                                    </span>
                                                                    <span>
                                                                        {(COMPONENT_WEIGHTS[component as keyof typeof COMPONENT_WEIGHTS] * quantity).toLocaleString()} kg
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

