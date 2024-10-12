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

export const mapGenType = (backendType: string): string => {
    return getGeneratorType(backendType);
}

const getGeneratorType = (type: string) => {
    switch (type) {
      case "GEN_RESTAURANT":
          return 'Restaurante';

      case "GEN_BUILDING":
          return 'Edificio';

      case "GEN_COMPANY":
          return 'Empresa';

      case "GEN_OFFICE":
          return 'Oficina';

      case "GEN_HOTEL":
          return 'Hotel';

      case "GEN_FACTORY":
          return 'Fábrica';

      case "GEN_CLUB":
          return 'Club';

      case "GEN_EDUCATIONAL_INSTITUTION":
          return 'Institución Educativa';

      case "GEN_HOSPITAL":
          return 'Hospital';

      case "GEN_MARKET":
          return 'Mercado';

      case "GEN_OTHER":
          return 'Otro';
    
      default:
          return 'Otro';
    }
  }
