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

export interface Address {
  id: number;
  street: string;
  number: string;
  city: string;
  province: string;
  lat: string;
  lng: string;
  zip_code: number;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  firebase_id: string;
  type: string;
  address: {
    id: number;
    street: string;
    number: string;
    city: string;
    province: string;
    lat: string;
    lng: string;
    zip_code: number;
  };
  phone: string;
  waste_type_config: { name: string }[];
  days: Day[];
}

export interface Truck {
  id: number;
  patent: string;
  model: string;
  brand: string;
  status: string;
  capacity: number;
  coop_id: number;
}

export type TrucksResources = Truck[];


export interface Driver {
  id: number;
  username: string;
  email: string;
  firebase_id: string;
  phone: string;
  addres_id: number;
  type: string;
  national_id: string;
}

export type DriversResources = Driver[];
