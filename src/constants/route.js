const RouteStatus = [
    { key: '1', value: 'CREATED;', label: 'Creada' },
    { key: '2', value: 'IN_PROGRESS', label: 'En progreso' },
    { key: '3', value: 'COMPLETED', label: 'Completada' },
    { key: '4', value: 'CANCELED', label: 'Cancelada' }
]

const mapRouteStatus = {
    CREATED: 'Creada',
    IN_PROGRESS: 'En progreso',
    COMPLETED: 'Completada',
    CANCELED: 'Cancelada'
}

export {
    RouteStatus,
    mapRouteStatus,
}