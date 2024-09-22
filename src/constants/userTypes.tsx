export const userTypeMapping = {
    cooperativa: 'COOP',
    generador: 'GEN',
    conductor: 'TRUCK_DRIVER'
};
  
export type UserType = keyof typeof userTypeMapping;