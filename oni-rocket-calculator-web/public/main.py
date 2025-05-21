# Constants based on Oxygen Not Included game mechanics
FUEL_EFFICIENCY = {
    "petroleum": 22.2,
    "hydrogen": 66.6,
}

OXIDIZER_EFFICIENCY = {
    "oxylite": 1.0,
    "fertilizer": 0.6,
}

ROCKET_ENGINE_MASS = {
    "steam": 200,
    "petroleum": 200,
    "hydrogen": 200,
}
FUEL_TANK_MASS = 100
OXIDIZER_TANK_MASS = 100

# --- Helper Functions ---

def calculate_total_weight(engine_type: str, fuel_mass: float, extra_components_mass: float, has_oxidizer_tank: bool) -> float:
    current_engine_mass = ROCKET_ENGINE_MASS.get(engine_type.lower(), 200)
    total_mass = current_engine_mass + FUEL_TANK_MASS + fuel_mass + extra_components_mass
    if has_oxidizer_tank:
        total_mass += OXIDIZER_TANK_MASS
    return total_mass

def calculate_viable_distance(fuel_type: str, oxidizer_type: str, total_rocket_mass: float) -> float:
    if total_rocket_mass <= 0:
        return 0.0

    fuel_type_lower = fuel_type.lower()
    oxidizer_type_lower = oxidizer_type.lower()

    fuel_eff = FUEL_EFFICIENCY.get(fuel_type_lower)
    
    # Steam engine is handled in the main function, does not use these dictionaries for efficiency.
    if fuel_type_lower == "steam":
        # This function is not directly called for steam distance calculation in calculate_rocket_distance_for_pyscript.
        # If it were, it would need the fuel_mass (water) to apply the 240 constant.
        # Returning 0.0 here if called directly for steam, as the main logic is elsewhere.
        return 0.0 

    oxidizer_eff_multiplier = OXIDIZER_EFFICIENCY.get(oxidizer_type_lower)

    if fuel_eff is None:
        print(f"Warning: Fuel type '{fuel_type}' not found in FUEL_EFFICIENCY.")
        return 0.0
    if oxidizer_eff_multiplier is None: # Check applies to non-steam engines
        print(f"Warning: Oxidizer type '{oxidizer_type}' not found in OXIDIZER_EFFICIENCY.")
        return 0.0
    
    # Simplified distance calculation for non-steam engines
    # distance = (Fuel Efficiency * Oxidizer Multiplier * Scaling Factor) / Total Mass
    distance = (fuel_eff * oxidizer_eff_multiplier * 100) / total_rocket_mass 
    return round(distance, 2)

# --- Main function for PyScript ---

def calculate_rocket_distance_for_pyscript(engine_type: str, fuel_type: str, oxidizer_type: str, fuel_mass: float, extra_components_mass: float) -> float:
    """
    Calculates the viable rocket distance based on inputs from JavaScript.
    engine_type: e.g., "petroleum", "hydrogen", "steam".
    fuel_type: e.g., "petroleum", "hydrogen", "steam" (where "steam" implies water as fuel).
    oxidizer_type: e.g., "oxylite", "fertilizer". For steam, this can be an empty string, "none", or None.
    fuel_mass: Mass of the fuel (water for steam engines).
    extra_components_mass: Mass of additional parts.
    """
    fuel_type_lower = fuel_type.lower()
    oxidizer_type_lower = oxidizer_type.lower() if oxidizer_type else "none"

    has_oxidizer_tank_bool = True
    # Steam engines in ONI use water heated by an external source, not a separate oxidizer tank for oxidizer_type chemicals.
    # "None" or empty string for oxidizer_type also implies no separate oxidizer tank.
    if fuel_type_lower == "steam" or oxidizer_type_lower == "none":
        has_oxidizer_tank_bool = False

    # Calculate total mass
    total_rocket_mass = calculate_total_weight(engine_type.lower(), fuel_mass, extra_components_mass, has_oxidizer_tank_bool)

    if total_rocket_mass <= 0:
        return 0.0

    # Specific logic for steam engines
    if fuel_type_lower == "steam":
        # ONI formula for steam engine range: Range (km) = 240 * (Water (kg) / Total Mass (kg))
        # Here, fuel_mass is expected to be the mass of water.
        distance = (240 * fuel_mass) / total_rocket_mass
        return round(distance, 2)

    # For non-steam engines that use fuel and oxidizer from dictionaries:
    calculated_distance = calculate_viable_distance(fuel_type, oxidizer_type, total_rocket_mass)
    return calculated_distance

print("main.py loaded for PyScript.")
