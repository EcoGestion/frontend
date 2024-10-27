const RouteRequestStatus = [
    { key: '1', value: 'PENDING', label: 'Pendiente' },
    { key: '2', value: 'ON_ROUTE', label: 'En ruta' },
    { key: '3', value: 'COMPLETED', label: 'Completada' },
    { key: '4', value: 'NEXT_ON_ROUTE', label: 'Siguiente en ruta' },
    { key: '5', value: 'REPROGRAMED', label: 'Reprogramada' },
    { key: '6', value: 'CANCELED', label: 'Cancelada' }
]

const mapRouteRequestStatus = {
    PENDING: 'Pendiente',
    ON_ROUTE: 'En ruta',
    COMPLETED: 'Completada',
    NEXT_ON_ROUTE: 'Siguiente en ruta',
    REPROGRAMED: 'Reprogramada',
    CANCELED: 'Cancelada'
}

const mapRouteRequestStatusToKey = {
    'Pendiente': 'PENDING',
    'En ruta': 'ON_ROUTE',
    'Completada': 'COMPLETED',
    'Siguiente en ruta': 'NEXT_ON_ROUTE',
    'Reprogramada': 'REPROGRAMED',
    'Cancelada': 'CANCELED'
}

export {
    RouteRequestStatus,
    mapRouteRequestStatus,
    mapRouteRequestStatusToKey
}