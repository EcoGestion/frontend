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

export interface WasteQuantity {
  id?: number;
  waste_type: string;
  quantity: number;
  waste_collection_request_id?: number;
}

export type WasteQuantities = WasteQuantity[];


export interface WasteCollectionRequest {
  id?: number;
  request_date: Date;
  pickup_date_from: Date;
  pickup_date_to: Date;
  generator_id: number | string | null;
  coop_id?: number;
  address?: Address;
  details: string;
  waste_quantities: WasteQuantities;
  status: 'OPEN' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
  generator?: UserInfo;
  coop?: UserInfo;
}

export type WasteCollectionRequests = WasteCollectionRequest[];

export interface RouteRequest {
  id: number;
  order: number;
  route_id: number;
  status: 'PENDING' | 'ON_ROUTE' | 'COMPLETED' | 'REPROGRAMED';
  delivery_time: Date;
  address_id: number;
  request_id: number;
  lat: string;
  lng: string;
}

export type RouteRequests = RouteRequest[];

export interface Route {
  id: number;
  total_weight: number;
  driver: UserInfo;
  truck: Truck;
  route_requests: RouteRequest[];
  status: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  created_at: Date;
  updated_at: Date;
}

export type Routes = Route[];

export interface GenHomeStats {
  open: number;
  pending: number;
  completed: number;
}