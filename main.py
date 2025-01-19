# Define constants for fuel and oxidizer properties
import math


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



def calculate_total_weight(fuel_type, fuel_weight, extra_components=[]):
    # Calculate weights of fuel and oxidizer
    fuel_and_oxidizer_weight = fuel_weight *2
    num_fuel_tanks = math.ceil(fuel_weight/FUEL_STORAGE_CAPACITY)
    num_oxidizer_tanks = math.ceil(fuel_weight/OXIDIZER_STORAGE_CAPACITY)

    # Calculate weights of storage
    fuel_storage_weight = num_fuel_tanks * FUEL_STORAGE_WEIGHT
    oxidizer_storage_weight = num_oxidizer_tanks * OXIDIZER_STORAGE_WEIGHT

    # Engine and capsule weights
    engine_weight = ENGINE_WEIGHT[fuel_type]
    capsule_weight = COMMAND_CAPSULE_WEIGHT

    # Calculate extra components weight
    extra_components_weight = sum(COMPONENT_WEIGHTS[component] for component in extra_components)

    # Total weight
    total_weight = (fuel_and_oxidizer_weight + fuel_storage_weight + 
                    oxidizer_storage_weight + engine_weight + capsule_weight + extra_components_weight)

    return total_weight

def calculate_weight_penalty(ship_weight):
    return max(ship_weight, (ship_weight / 300) ** 3.2)


def calculate_viable_distance(distance, fuel_type, oxidizer_type, ship_weight):
    return

print("Total Weight:", calculate_total_weight("petroleum", 208))

# viable_distance = calculate_viable_distance(50000, "petroleum", "liquid_oxygen",calculate_total_weight("petroleum", 1, 1, []))
# print("Fuel Needed for 50,000km:", viable_distance)



