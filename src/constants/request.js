const RequestStatus = [
    { key: '1', value: 'OPEN', label: 'Abierta' },
    { key: '2', value: 'PENDING', label: 'Pendiente' },
    { key: '3', value: 'ON_ROUTE', label: 'En ruta' },
    { key: '4', value: 'NEXT_ON_ROUTE', label: 'Siguiente en ruta' },
    { key: '5', value: 'COMPLETED', label: 'Completada' },
    { key: '6', value: 'REJECTED', label: 'Rechazada' }
]

const mapRequestStatus = {
    OPEN: 'Abierta',
    PENDING: 'Pendiente',
    ON_ROUTE: 'En ruta',
    NEXT_ON_ROUTE: 'Siguiente en ruta',
    COMPLETED: 'Completada',
    REJECTED: 'Rechazada'
}

const mapRequestStatusToKey = {
    'Abierta': 'OPEN',
    'Pendiente': 'PENDING',
    'En ruta': 'ON_ROUTE',
    'Siguiente en ruta': 'NEXT_ON_ROUTE',
    'Completada': 'COMPLETED',
    'Rechazada': 'REJECTED'
}

export {
    RequestStatus,
    mapRequestStatus,
    mapRequestStatusToKey
}