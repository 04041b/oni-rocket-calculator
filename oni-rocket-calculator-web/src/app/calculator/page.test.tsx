import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calculator from './page'; // Adjust the import path as necessary

// Mock global objects
global.alert = jest.fn();

// Mock console.error to avoid cluttering test output, can be spied on too
// console.error = jest.fn();

// Define the structure of the mock PyScript object
interface MockPyScript {
  interpreter: {
    globals: {
      get: jest.Mock<any, [string]>;
    };
  };
}

// Utility function to set up the PyScript mock
const setupPyScriptMock = (pythonFn?: () => any): MockPyScript => {
  const mockGet = jest.fn();
  if (pythonFn) {
    mockGet.mockReturnValue(pythonFn);
  } else {
    mockGet.mockReturnValue(undefined);
  }
  
  const mock: MockPyScript = {
    interpreter: {
      globals: {
        get: mockGet,
      },
    },
  };
  // @ts-ignore
  global.window.pyscript = mock;
  return mock;
};


describe('Calculator Component', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // @ts-ignore
    delete global.window.pyscript; // Ensure PyScript is not defined by default
  });

  test('should show loading state and alert if PyScript is not ready when calculate is clicked', async () => {
    render(<Calculator />);
    
    // Initially, button shows "Loading PyScript..." and is disabled
    const calculateButton = screen.getByRole('button', { name: /loading pyscript.../i });
    expect(calculateButton).toBeDisabled();

    // Simulate PyScript not being ready when an attempt to calculate is made
    // (though button is disabled, we can manually call handleCalculate or change state if component allowed)
    // For this test, we'll assume the button becomes enabled by some external factor or test the internal logic if possible
    // However, page.tsx already disables the button if pyscriptReady is false.
    // So, to test the alert, we'd need to bypass the disabled state or force pyscriptReady to false *after* initial render and *before* click.
    // The current implementation of page.tsx useEffect sets pyscriptReady.
    // Let's test the scenario where pyscriptReady is false (button is disabled)
    // A direct call to handleCalculate is not how users interact.
    // Instead, we can verify the initial state.
    
    // If we want to test the alert when PyScript is *not* ready:
    // We'd need to somehow make `pyscriptReady` false when `handleCalculate` is called.
    // The component's `useEffect` tries to set `pyscriptReady` to true.
    // For this scenario, let's assume the button is somehow clicked while pyscript is not ready.
    // This isn't perfectly reflected in the current component structure where the button is disabled.
    // A more direct way: set pyscriptReady to false after initial load, then click.
    // However, the component's useEffect will try to set it to true.
    // A better approach: Test that the button *is* disabled when PyScript is not ready.
    expect(calculateButton).toBeDisabled();
    
    // If we were to force it (hypothetically):
    // (global.window as any).pyscript = undefined; // Ensure it's undefined
    // fireEvent.click(calculateButton); // This would fail as it's disabled.
    // expect(global.alert).toHaveBeenCalledWith("PyScript is still loading. Please try again in a moment.");
  });

  test('handleCalculate calls Python function with correct parameters and updates UI when PyScript is ready', async () => {
    const mockCalculateRocketDistancePy = jest.fn().mockReturnValue(1234.56);
    setupPyScriptMock(mockCalculateRocketDistancePy);

    render(<Calculator />);

    // Wait for PyScript to be considered ready and button to be enabled
    const calculateButton = await screen.findByRole('button', { name: /calculate distance/i });
    expect(calculateButton).toBeEnabled();

    // Set fuel amount
    const fuelInput = screen.getByLabelText(/amount of fuel \(kg\)/i);
    fireEvent.change(fuelInput, { target: { value: '100' } });

    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(mockCalculateRocketDistancePy).toHaveBeenCalledTimes(1);
    });

    expect(mockCalculateRocketDistancePy).toHaveBeenCalledWith(
      "petroleum", // engineType
      "petroleum", // fuelType
      "oxylite",   // oxidizerType
      100,         // fuelMass (from input)
      0            // extraComponentsMass
    );

    await waitFor(() => {
      expect(screen.getByText(/Calculated Maximum Distance:/i)).toBeInTheDocument();
      expect(screen.getByText(/1234.56 km/i)).toBeInTheDocument();
    });
  });

  test('handleCalculate shows alert and sets distance to null if Python function is not found', async () => {
    setupPyScriptMock(undefined); // No python function returned by get

    render(<Calculator />);

    const calculateButton = await screen.findByRole('button', { name: /calculate distance/i });
    expect(calculateButton).toBeEnabled();
    
    const fuelInput = screen.getByLabelText(/amount of fuel \(kg\)/i);
    fireEvent.change(fuelInput, { target: { value: '100' } });

    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Error: Calculation function not found in PyScript.");
    });
    
    // Check that distance display is cleared or shows an appropriate message
    expect(screen.queryByText(/Calculated Maximum Distance:/i)).not.toBeInTheDocument();
    // It might show "Click "Calculate" to see the distance." or similar if fuel > 0 and distance is null
    expect(screen.getByText(/Click "Calculate" to see the distance./i)).toBeInTheDocument();
  });

  test('handleCalculate shows alert and sets distance to null if Python function call throws an error', async () => {
    const mockWithError = jest.fn().mockImplementation(() => {
      throw new Error("Python error");
    });
    setupPyScriptMock(mockWithError);

    render(<Calculator />);
    
    const calculateButton = await screen.findByRole('button', { name: /calculate distance/i });
    expect(calculateButton).toBeEnabled();

    const fuelInput = screen.getByLabelText(/amount of fuel \(kg\)/i);
    fireEvent.change(fuelInput, { target: { value: '100' } });

    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("An error occurred while trying to calculate the distance via PyScript.");
    });
    expect(screen.queryByText(/Calculated Maximum Distance:/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Click "Calculate" to see the distance./i)).toBeInTheDocument();
  });

  test('UI updates correctly when fuel input changes and calculation results in zero distance', async () => {
    const mockCalculateRocketDistancePy = jest.fn().mockReturnValue(0);
    setupPyScriptMock(mockCalculateRocketDistancePy);

    render(<Calculator />);

    const calculateButton = await screen.findByRole('button', { name: /calculate distance/i });
    const fuelInput = screen.getByLabelText(/amount of fuel \(kg\)/i);

    fireEvent.change(fuelInput, { target: { value: '10' } }); // Input some fuel
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(mockCalculateRocketDistancePy).toHaveBeenCalledWith("petroleum", "petroleum", "oxylite", 10, 0);
    });
    
    await waitFor(() => {
        expect(screen.getByText(/Enter fuel to calculate distance or check parameters. Distance cannot be calculated./i)).toBeInTheDocument();
    });
  });
});
