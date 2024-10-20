const wasteTypesDefault = [
    { id: 1, label: 'Papel', value:'Papel', name: 'PAPER', checked: false, quantity: 0 },
    { id: 2, label: 'Metal', value:'Metal', name: 'METAL', checked: false, quantity: 0 },
    { id: 3, label: 'Vidrio', value:'Vidrio', name: 'GLASS', checked: false, quantity: 0 },
    { id: 4, label: 'Plástico', value:'Plástico', name: 'PLASTIC', checked: false, quantity: 0 },
    { id: 5, label: 'Cartón', value:'Cartón', name: 'CARDBOARD', checked: false, quantity: 0 },
    { id: 6, label: 'Tetra Brik', value:'Tetra Brik', name: 'TETRA_BRIK', checked: false, quantity: 0 },
    { id: 7, label: 'Telgopor', value:'Telgopor', name: 'STYROFOAM', checked: false, quantity: 0 },
    { id: 8, label: 'Pilas', value:'Pilas', name: 'BATTERIES', checked: false, quantity: 0 },
    { id: 9, label: 'Aceite', value:'Aceite', name: 'OIL', checked: false, quantity: 0 },
    { id: 10, label: 'Electrónicos', value:'Electrónicos', name: 'ELECTRONICS', checked: false, quantity: 0 }
];

const mapMaterialNameToLabel = {
    PAPER: 'Papel',
    METAL: 'Metal',
    GLASS: 'Vidrio',
    PLASTIC: 'Plástico',
    CARDBOARD: 'Cartón',
    TETRA_BRIK: 'Tetra Brik',
    STYROFOAM: 'Telgopor',
    BATTERIES: 'Pilas',
    OIL: 'Aceite',
    ELECTRONICS: 'Electrónicos',
};

export { wasteTypesDefault, mapMaterialNameToLabel };