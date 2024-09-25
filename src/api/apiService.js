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
  const response = await axios.get(`${API_BASE_URL}/waste_requests/${orderId}`);
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

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_BASE_URL}/user/${userId}`);
  return response.data;
}