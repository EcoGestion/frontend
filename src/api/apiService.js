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

export const getOrdersById = async (userId) => {
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