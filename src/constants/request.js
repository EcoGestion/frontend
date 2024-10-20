const RequestStatus = [
    { key: '1', value: 'OPEN', label: 'Abierta' },
    { key: '2', value: 'PENDING', label: 'Pendiente' },
    { key: '3', value: 'ON_ROUTE', label: 'En ruta' },
    { key: '4', value: 'COMPLETED', label: 'Completada' },
    { key: '5', value: 'CANCELLED', label: 'Cancelada' },
    { key: '6', value: 'REPROGRAMED', label: 'Reprogramada' },
]

const mapRequestStatus = {
    OPEN: 'Abierta',
    PENDING: 'Pendiente',
    ON_ROUTE: 'En ruta',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada',
    REPROGRAMED: 'Reprogramada',
}

const mapRequestStatusToKey = {
    'Abierta': 'OPEN',
    'Pendiente': 'PENDING',
    'En ruta': 'ON_ROUTE',
    'Completada': 'COMPLETED',
    'Cancelada': 'CANCELLED',
    'Reprogramada': 'REPROGRAMED',
}

export {
    RequestStatus,
    mapRequestStatus,
    mapRequestStatusToKey
}