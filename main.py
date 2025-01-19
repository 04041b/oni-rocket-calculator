# Define constants for fuel and oxidizer properties
FUEL_EFFICIENCY = {
    "steam": 20,          # km/kg
    "petroleum": 40,      # km/kg
    "liquid_hydrogen": 60 # km/kg
}

OXIDIZER_EFFICIENCY = {
    "oxylite": 1.0,       # 100%
    "liquid_oxygen": 1.33 # 133%
}

# Define weights of storage containers and capacities
FUEL_STORAGE_WEIGHT = 100  # kg
FUEL_STORAGE_CAPACITY = 900 # kg

OXIDIZER_STORAGE_WEIGHT = 100    # kg
OXIDIZER_STORAGE_CAPACITY = 2700 # kg

# Define engine and capsule weights
ENGINE_WEIGHT = {
    "steam": 200,          # kg
    "petroleum": 200,      # kg
    "liquid_hydrogen": 500 # kg
}

COMMAND_CAPSULE_WEIGHT = 200 # kg

# Define extra components
COMPONENT_WEIGHTS = {
    "cargo_bay": 2000,          # kg
    "liquid_cargo_bay": 2000,   # kg
    "gas_cargo_bay": 2000,      # kg
    "sightseeing": 200,         # kg
    "research_station": 200     # kg
}

def calculate_weight_penalty(ship_weight):
    return max(ship_weight, (ship_weight / 300) ** 3.2)



# Function to calculate fuel needed for a given distance
def calculate_fuel_needed(distance, fuel_type, oxidizer_type, weight):
    fuel_efficiency = FUEL_EFFICIENCY[fuel_type]
    oxidizer_efficiency = OXIDIZER_EFFICIENCY[oxidizer_type]
    
    # Effective efficiency with oxidizer
    effective_efficiency_w_LQ = fuel_efficiency * oxidizer_efficiency

    # Calculate total fuel required
    total_fuel_needed = distance / effective_efficiency_w_LQ


    # Calculate fuel and oxidizer amounts (1:1 ratio)
    total_oxidizer_needed = total_fuel_needed

    return {
        "total_fuel_needed": total_fuel_needed,  # kg
        "total_oxidizer_needed": total_oxidizer_needed # kg
    }

fuel_needed = calculate_fuel_needed(50000, "petroleum", "liquid_oxygen")
print("Fuel Needed for 50,000km:", fuel_needed)