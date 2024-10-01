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
  zone: string;
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
  address: Address;
  phone: string;
  waste_type_config: { name: string }[];
  days: Day[];
}

export interface Truck {
  id: number;
  patent: string;
  model: string;
  brand: string;
  status: 'ENABLED' | 'DISABLE' | 'ON_ROUTE';
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


export interface WasteCollectionRequest {
  id?: number;
  request_date: Date;
  pickup_date_from: Date;
  pickup_date_to: Date;
  generator_id: number | string | null;
  coop_id?: number;
  address?: Address;
  details: string;
  waste_quantities: {waste_type: string, quantity: number}[];
  status: 'OPEN' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
}

export type WasteCollectionRequests = WasteCollectionRequest[];