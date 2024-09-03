export interface Day {
    id: number;
    name: string;
    name_spanish: string;
    active: boolean;
    begin_at: string;
    end_at: string;
  }
  
  export interface Item {
    id: number;
    label: string;
    name: string;
    checked: boolean;
  }
  
  export interface UserInfo {
    username: string;
    email: string;
    address: {
      street: string;
      number: string;
      city: string;
      province: string;
    };
    phone: string;
    waste_type_config: { name: string }[];
    days: Day[];
  }