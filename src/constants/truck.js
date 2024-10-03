const TruckStatus = [
    { key: '1', value: 'ENABLED', label: 'Disponible' },
    { key: '2', value: 'DISABLE', label: 'No disponible' },
    { key: '3', value: 'ON_ROUTE', label: 'En uso' },
]

const mapTruckStatus = {
    ENABLED: 'Disponible',
    DISABLE: 'No disponible',
    ON_ROUTE: 'En uso',
}

export {
    TruckStatus,
    mapTruckStatus,
}