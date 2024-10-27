const RouteStatus = [
    { key: '1', value: 'CREATED;', label: 'Creada' },
    { key: '2', value: 'IN_PROGRESS', label: 'En proceso' },
    { key: '3', value: 'COMPLETED', label: 'Completada' },
    { key: '4', value: 'CANCELED', label: 'Cancelada' },
    { key: '5', value: 'PARTIALLY_COMPLETED', label: 'Completada parcialmente' }
]

const mapRouteStatus = {
    CREATED: 'Creada',
    IN_PROGRESS: 'En proceso',
    COMPLETED: 'Completada',
    CANCELED: 'Cancelada',
    PARTIALLY_COMPLETED: 'Completada parcialmente'
}

const mapRouteStatusToKey = {
    'Creada': 'CREATED',
    'En proceso': 'IN_PROGRESS',
    'Completada': 'COMPLETED',
    'Cancelada': 'CANCELED',
    'Completada parcialmente': 'PARTIALLY_COMPLETED'
}

export {
    RouteStatus,
    mapRouteStatus,
    mapRouteStatusToKey
}