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

export const getOpenOrders = async () => {
  const requestBody =
  {
    operations: 
    [
      {
        op: "EQ", 
        attribute: "status", 
        value: "OPEN", 
        model: "WasteCollectionRequest"
      }
    ]
  }
  const response = await axios.post(`${API_BASE_URL}/waste_request/filter`, requestBody);
  return response.data;
};

export const createRequest = async (requestData) => {
  const response = await axios.post(`${API_BASE_URL}/waste_collection_requests`, requestData);
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

export const updateOrderById = async (orderId, coopId, status) => {
  console.log(coopId)
  console.log(parseInt(coopId, 10))
  console.log(status)
  console.log(orderId)
  const requestBody =
  {
    coop_id: parseInt(coopId, 10), 
    status: status
  }
  const response = await axios.put(`${API_BASE_URL}/waste_request/${orderId}`, requestBody);
  return response.data;
};

export const getTrucksById = async (coopId) => {
  const response = await axios.get(`${API_BASE_URL}/truck/coop/${coopId}`);
  return response.data;
};
