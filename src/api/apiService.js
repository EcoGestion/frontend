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

export const getPendingOrders = async () => {
  const requestBody =   {
    operations: 
    [
      {
        op: "EQ", 
        attribute: "status", 
        value: "PENDING", 
        model: "WasteCollectionRequest"
      }
    ]
}
  const response = await fetch(`${API_BASE_URL}/waste_request/filter`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody), 
  });
  
  const data = await response.json();
  return data;
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
  const response = await axios.get(`${API_BASE_URL}/waste_requests/${orderId}`);
  return response.data;
};
