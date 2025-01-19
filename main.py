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



wanted_distance = input("wanted distance")