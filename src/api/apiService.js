import axios from 'axios';

const API_BASE_URL = 'https://ecogestion-back.onrender.com';

export const createUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/user`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/login`, userData);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
  return response.data;
};

export const getCoopOrdersById = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/coop_requests`);
  return response.data;
};

export const createRequest = async (requestData) => {
  const response = await axios.post(`${API_BASE_URL}/waste_collection_requests`, requestData);
  return response.data;
}

export const createTruck = async (truckData) => {
  const response = await axios.post(`${API_BASE_URL}/truck`, truckData);
  return response.data;
}

export const getGeneratorOrdersById = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/waste_collection_requests`);
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axios.get(`${API_BASE_URL}/waste_request/${orderId}`);
  return response.data;
};

export const getTrucksByCoopId = async (coopId) => {
  const response = await axios.get(`${API_BASE_URL}/truck/coop/${coopId}`);
  return response.data;
}

export const getDriversByCoopId = async (coopId) => {
  const response = await axios.get(`${API_BASE_URL}/driver/coop/${coopId}`);
  return response.data;
}

export const updateTruckStatus = async (truckId, truck) => {
  const response = await axios.put(`${API_BASE_URL}/truckstatus/${truckId}`, truck);
  return response.data;
}

export const deleteTruck = async (truckId) => {
  const response = await axios.delete(`${API_BASE_URL}/truck/${truckId}`);
  return response.data;
}

export const deleteUserById = async (userId) => {
  const response = await axios.delete(`${API_BASE_URL}/user/${userId}`);
  return response.data;
}

export const createRoute = async (routeData) => {
  const response = await axios.post(`${API_BASE_URL}/route`, routeData);
  return response.data;
}

export const getRequestsWithFilter = async (filters) => {
  console.log(filters);
  const response = await axios.post(`${API_BASE_URL}/waste_request/filter`, filters);
  return response.data;
}

export const getCoopPendingRequests = async (coopId) => {
  const requests_filters = {
    "operations": [
    {"op": "EQ", "attribute": "id", "value": coopId, "model": "Coop"},
    {"op": "EQ", "attribute": "status", "value": "PENDING", "model": "WasteCollectionRequest"},
    ]
  };
  const response = await getRequestsWithFilter(requests_filters);
  return response;
}

export const getCoopRoutes = async (coopId) => {
  const response = await axios.get(`${API_BASE_URL}/route/coop/${coopId}`);
  return response.data;
}

export const getRoutesWithFilter = async (filters) => {
  const response = await axios.post(`${API_BASE_URL}/route/filter`, filters);
  return response.data;
}

export const getCoopActiveRoutes = async (coopId) => {
  const requests_filters = {
    "operations": [
    {"op": "EQ", "attribute": "id", "value": coopId, "model": "Coop"},
    {"op": "IN", "attribute": "status", "value": ["CREATED", "IN_PROGRESS"], "model": "Route"}
    ]
  };
  const response = await getRoutesWithFilter(requests_filters);
  return response;
}

export const getRouteById = async (routeId) => {
  const response = await axios.get(`${API_BASE_URL}/route/${routeId}`);
  return response.data;
}

export const getRequestsByRouteId = async (routeId) => {
  const response = await axios.get(`${API_BASE_URL}/waste_request/route/${routeId}`);
  return response.data;
}