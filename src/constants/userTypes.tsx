export const userTypeMapping = {
    cooperativa: 'COOP',
    generador: 'GEN',
    conductor: 'TRUCK_DRIVER'
};

export type UserType = keyof typeof userTypeMapping;
  
export const mapUserType = (backendType: string): UserType | null => {
    if (backendType.startsWith('GEN')) {
        return 'generador';
    }
    const entry = Object.entries(userTypeMapping).find(([, value]) => value === backendType);
    return entry ? entry[0] as UserType : null;
};

export const generatorTypes = [
    {id:1, value: "Restaurante", label: "Restaurante", backendValue: "GEN_RESTAURANT"},
    {id:2, value: "Edificio", label: "Edificio", backendValue: "GEN_BUILDING"},
    {id:3, value: "Empresa", label: "Empresa", backendValue: "GEN_COMPANY"},
    {id:4, value: "Oficina", label: "Oficina", backendValue: "GEN_OFFICE"},
    {id:5, value: "Hotel", label: "Hotel", backendValue: "GEN_HOTEL"},
    {id:6, value: "Fábrica", label: "Fábrica", backendValue: "GEN_FACTORY"},
    {id:7, value: "Club", label: "Club", backendValue: "GEN_CLUB"},
    {id:8, value: "Institución Educativa", label: "Institución Educativa", backendValue: "GEN_EDUCATIONAL_INSTITUTION"},
    {id:9, value: "Hospital", label: "Hospital", backendValue: "GEN_HOSPITAL"},
    {id:10, value: "Mercado", label: "Mercado", backendValue: "GEN_MARKET"},
    {id:11, value: "Otro", label: "Otro", backendValue: "GEN_OTHER"}
  ];

export const mapGenType = (backendType: string): string => {
    const entry = generatorTypes.find(({backendValue}) => backendValue === backendType);
    return entry ? entry.value : 'Otro';
}