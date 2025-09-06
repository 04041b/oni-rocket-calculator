import { useEffect, useState } from 'react';
import { loadPyodide } from 'pyodide';
import { createChart } from '@/utils/chartUtils';
import { pythonCalculatorCode } from '@/utils/pythonCalculator';

export function usePyodide() {
    const [pyodide, setPyodide] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function initPyodide() {
            try {
                setIsLoading(true);
                
                // Load Pyodide
                const pyodideInstance = await loadPyodide();
                
                // Load micropip
                await pyodideInstance.loadPackage("micropip");
                
                // Install packages
                await pyodideInstance.runPythonAsync(`
                    import micropip
                    await micropip.install(["matplotlib", "numpy"])
                `);
                
                // Make chart creation function available to Python
                (window as any).createChart = createChart;
                
                // Run the main calculator code
                pyodideInstance.runPython(pythonCalculatorCode);
                
                setPyodide(pyodideInstance);
                setError(null);
            } catch (err) {
                console.error('Error initializing Pyodide:', err);
                setError(err instanceof Error ? err.message : 'Failed to initialize Pyodide');
            } finally {
                setIsLoading(false);
            }
        }

        initPyodide();
    }, []);

    return { pyodide, isLoading, error };
}
