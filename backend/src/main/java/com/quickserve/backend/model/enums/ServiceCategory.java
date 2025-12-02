package com.quickserve.backend.model.enums;

public enum ServiceCategory {
    PLUMBING("Plumbing"),
    ELECTRICAL("Electrical"),
    CLEANING("Cleaning"),
    CARPENTRY("Carpentry"),
    PAINTING("Painting"),
    HVAC("HVAC"),
    LANDSCAPING("Landscaping"),
    PEST_CONTROL("Pest Control"),
    APPLIANCE_REPAIR("Appliance Repair"),
    HOME_SECURITY("Home Security"),
    ROOFING("Roofing"),
    FLOORING("Flooring");

    private final String displayName;

    ServiceCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
