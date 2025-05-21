'use client';

import Head from 'next/head';
import { useState, useEffect } from "react";

// Extend window type to include pyscript
declare global {
    interface Window {
        pyscript?: {
            interpreter: {
                globals: {
                    get: (name: string) => any;
                }
            }
        };
    }
}

export default function Calculator() {
    const [fuel, set_fuel] = useState(0);
    const [distance, setDistance] = useState<number | null>(null);
    const [pyscriptReady, setPyscriptReady] = useState(false);

    useEffect(() => {
        // Check for PyScript readiness
        // A more robust way might be to listen to an event PyScript dispatches when ready
        const checkPyScript = () => {
            if (window.pyscript && window.pyscript.interpreter) {
                console.log("PyScript is ready.");
                setPyscriptReady(true);
            } else {
                console.log("PyScript not ready yet, checking again in 500ms.");
                setTimeout(checkPyScript, 500); // Check again shortly
            }
        };
        checkPyScript();
        
        // Original log message
        console.log("Calculator component mounted. PyScript should be loading/loaded.");
    }, []);

    const handleCalculate = async () => {
        console.log("Calculate button clicked. Fuel:", fuel);

        if (!pyscriptReady) {
            console.error("PyScript is not ready. Cannot call Python function.");
            setDistance(null); // Clear previous distance if any
            // Optionally, display a message to the user
            alert("PyScript is still loading. Please try again in a moment.");
            return;
        }

        try {
            const pyodide = window.pyscript!.interpreter; // Non-null assertion as we checked pyscriptReady
            const calculateRocketDistancePy = pyodide.globals.get('calculate_rocket_distance_for_pyscript');
            
            if (calculateRocketDistancePy) {
                // Parameters for the Python function:
                const engineType = "petroleum"; // Assuming petroleum engine for petroleum fuel
                const fuelType = "petroleum";
                const oxidizerType = "oxylite"; // Using "oxylite" as per main.py
                const fuelMass = fuel; // From state
                const extraComponentsMass = 0; // Float, not list

                console.log(`Calling Python with: engine='${engineType}', fuel_type='${fuelType}', oxidizer='${oxidizerType}', fuel_mass=${fuelMass}, extras=${extraComponentsMass}`);
                
                const result: number = calculateRocketDistancePy(
                    engineType,
                    fuelType,
                    oxidizerType,
                    fuelMass,
                    extraComponentsMass
                );
                console.log("Distance calculated by Python:", result);
                setDistance(result);
            } else {
                console.error("Python function 'calculate_rocket_distance_for_pyscript' not found.");
                setDistance(null);
                alert("Error: Calculation function not found in PyScript.");
            }
        } catch (error) {
            console.error("Error calling Python function or PyScript not fully initialized:", error);
            setDistance(null);
            alert("An error occurred while trying to calculate the distance via PyScript.");
        }
    };

    return (
    <>
        <Head>
            <title>ONI Rocket Calculator</title>
            <link rel="stylesheet" href="https://pyscript.net/latest/pyscript.css" />
            {/* Ensure pyscript.js is loaded */}
            <script defer src="https://pyscript.net/latest/pyscript.js"></script>
        </Head>
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4 ">Base Game Rocket Calculator</h1>
            <div className="mb-4">
                <label htmlFor="fuelAmount" className="block text-sm font-medium text-gray-700">Amount of Fuel (kg)</label>
                <input
                    id="fuelAmount"
                    type="number"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                    placeholder="Enter amount of fuel"
                    value={fuel}
                    onChange={(e) => {set_fuel(parseInt(e.target.value || '0'));}}
                />
            </div>
            
            <button
                className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-400"
                onClick={handleCalculate}
                disabled={!pyscriptReady} // Disable button until PyScript is ready
            >
                {pyscriptReady ? "Calculate Distance" : "Loading PyScript..."}
            </button>

            {distance !== null && distance > 0 && (
                <p className="mt-4 text-lg">Calculated Maximum Distance: <span className="font-bold">{distance} km</span></p>
            )}
            {distance === 0 && (
                <p className="mt-4 text-lg">Enter fuel to calculate distance or check parameters. Distance cannot be calculated.</p>
            )}
            {distance === null && fuel > 0 && (
                 <p className="mt-4 text-lg">Click "Calculate" to see the distance.</p>
            )}


            {/* PyScript tag to load and run the Python script */}
            {/* It's good practice to ensure this script tag is correctly placed and executes */}
            <py-script id="pyCalc" src="/main.py"></py-script>
        </div>
    </>
    );
};

