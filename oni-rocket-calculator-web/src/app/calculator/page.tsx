'use client';

import { loadPyodide } from 'pyodide';
import { useState } from "react";
const calculate = async (fuel: number) => {
    // Add your calculation logic here
    console.log("Calculate button clicked ", fuel);
    
};


export default async function calculator() {
    const pyodide = await loadPyodide();
    const [fuel, set_fuel] = useState(0);
    return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4 ">Base Game Rocket Calculator</h1>
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Amount of Fuel</label>
            <input
                type="number"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                placeholder="Enter amount of fuel"
                onChange={(e) => {set_fuel(parseInt(e.target.value));}}
            />
        </div>
        
        <button
            className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
            onClick={() => calculate(fuel)}></button>


    </div>
    );
};

