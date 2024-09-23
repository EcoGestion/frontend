export const userTypeMapping = {
    cooperativa: 'COOP',
    generador: 'GEN',
    conductor: 'TRUCK_DRIVER'
};
  
export const mapUserType = (backendType: string): UserType | null => {
if (backendType.startsWith('GEN')) {
    return 'generador';
}
const entry = Object.entries(userTypeMapping).find(([, value]) => value === backendType);
return entry ? entry[0] as UserType : null;
};

export type UserType = keyof typeof userTypeMapping;