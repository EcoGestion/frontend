const FormatTruckString = (truck) => {
    return `${truck.brand} - ${truck.patent}`;
}

const FormatTruckCapacityToBack = (truck) => {
    // multiply by 1000 to convert to kg
    return { ...truck, capacity: truck.capacity * 1000 };
}

const FormatTruckCapacityToFront = (truck) => {
    // divide by 1000 to convert to tons
    return { ...truck, capacity: truck.capacity / 1000 };
}

export { FormatTruckString, FormatTruckCapacityToBack, FormatTruckCapacityToFront };