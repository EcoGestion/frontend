import axios from 'axios';

// const API_BASE_URL = 'https://ecogestion-back.onrender.com';
// const API_BASE_URL = 'http://3.20.73.155:443';
// const API_BASE_URL = 'http://18.118.247.32:443';
const API_BASE_URL = ' https://ecogestion.xyz';

export const createUser = async (userData, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.post(`${API_BASE_URL}/user`, userData, {headers});
  return response.data;
};

export const loginUser = async (userData, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.post(`${API_BASE_URL}/login`, userData, {headers});
  return response.data;
};

export const getUserById = async (userId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {headers});
  return response.data;
};

export const getCoopOrdersById = async (userId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/coop_requests`, {headers});
  return response.data;
};

export const getOpenOrders = async (access_token) => {
  const headers = {
    Authorization: access_token,
  };
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
  const response = await axios.post(`${API_BASE_URL}/waste_request/filter`, requestBody, {headers});
  return response.data;
};

export const createRequest = async (requestData, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.post(`${API_BASE_URL}/waste_collection_requests`, requestData, {headers});
  return response;
}

export const createTruck = async (truckData, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.post(`${API_BASE_URL}/truck`, truckData, {headers});
  return response.data;
}

export const getGeneratorOrdersById = async (userId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/waste_collection_requests`, {headers});
  return response.data;
};

export const getOrderById = async (orderId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/waste_request/${orderId}`, {headers});
  return response.data;
};

export const updateOrderById = async (orderId, coopId, status, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const requestBody =
  {
    coop_id: parseInt(coopId, 10), 
    status: status
  }
  const response = await axios.put(`${API_BASE_URL}/waste_request/${orderId}`, requestBody, {headers});
  return response.data;
};

export const acceptOrderById = async (orderId, coopId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const requestBody =
  {
    coop_id: parseInt(coopId, 10), 
    status: 'PENDING'
  }
  const response = await axios.put(`${API_BASE_URL}/assign_waste_request/${orderId}`, requestBody, {headers});
  return response.data;
};

export const getTrucksById = async (coopId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/truck/coop/${coopId}`, {headers});
  return response.data;
};

export const getTrucksByCoopId = async (coopId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/truck/coop/${coopId}`, {headers});
  return response.data;
}

export const getDriversByCoopId = async (coopId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/driver/coop/${coopId}`, {headers});
  return response.data;
}

export const updateTruckStatus = async (truckId, truck, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.put(`${API_BASE_URL}/truckstatus/${truckId}`, truck, {headers});
  return response.data;
}

export const deleteTruck = async (truckId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.delete(`${API_BASE_URL}/truck/${truckId}`, {headers});
  return response.data;
}

export const deleteUserById = async (userId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.delete(`${API_BASE_URL}/user/${userId}`, {headers});
  return response.data;
}

export const getRoutesByDriverId = async (driverId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  console.log(driverId)
  const requestBody =
  {
    operations: 
    [
      {
        op: "EQ", 
        attribute: "id", 
        value: parseInt(driverId, 10), 
        model: "User"
      }
    ]
  }
  const response = await axios.post(`${API_BASE_URL}/route/filter`, requestBody, {headers});
  return response.data;
}

export const createRoute = async (routeData, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.post(`${API_BASE_URL}/route`, routeData, {headers});
  return response.data;
}

export const getRequestsWithFilter = async (filters, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.post(`${API_BASE_URL}/waste_request/filter`, filters, {headers});
  return response.data;
}

export const getCoopPendingRequests = async (coopId, access_token) => {
  const requests_filters = {
    "operations": [
    {"op": "EQ", "attribute": "coop_id", "value": coopId, "model": "WasteCollectionRequest"},
    {"op": "EQ", "attribute": "status", "value": "PENDING", "model": "WasteCollectionRequest"}
    ]
  };
  const response = await getRequestsWithFilter(requests_filters, access_token);
  return response;
}

export const getCoopRoutes = async (coopId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/route/coop/${coopId}`, {headers});
  return response.data;
}

export const getRoutesWithFilter = async (filters, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.post(`${API_BASE_URL}/route/filter`, filters, {headers});
  return response.data;
}

export const getCoopActiveRoutes = async (coopId, access_token) => {
  const requests_filters = {
    "operations": [
    {"op": "EQ", "attribute": "coop_id", "value": coopId, "model": "Truck"},
    {"op": "IN", "attribute": "status", "value": ["CREATED", "IN_PROGRESS"], "model": "Route"}
    ]
  };
  const response = await getRoutesWithFilter(requests_filters, access_token);
  return response;
}

export const getDriverHomeRoutes = async (driverId, access_token) => {
  const requests_filters = {
    "operations": [
    {"op": "EQ", "attribute": "driver_id", "value": driverId, "model": "Route"},
    {"op": "IN", "attribute": "status", "value": ["CREATED", "IN_PROGRESS"], "model": "Route"}
    ]
  };
  const response = await getRoutesWithFilter(requests_filters, access_token);
  return response;
}

export const getRouteById = async (routeId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/route/${routeId}`, {headers});
  return response.data;
}

export const getRequestsByRouteId = async (routeId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/waste_request/route/${routeId}`, {headers});
  return response.data;
}

export const startRouteById = async (routeId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.put(`${API_BASE_URL}/route/${routeId}/start`, {headers});
  return response.data;
}

export const updateRouteRequestById = async (routeRequestId, routeId, status, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.put(`${API_BASE_URL}/route_requests/${routeRequestId}/route/${routeId}?status=${status}`, {headers});
  return response.data;
}

export const getGeneratorHomeStats = async (userId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/generator/${userId}/home_stats`, {headers});
  return response.data;
}

export const getGeneratorNotifications = async (userId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.get(`${API_BASE_URL}/notifications/${userId}`, {headers});
  return response.data;
}

export const verifyGeneratorCode = async (routeRequestId, code, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.post(`${API_BASE_URL}/route_request/${routeRequestId}/code/${code}`, {headers});
  return response.data;
}

export const release_waste_request = async (routeRequestId, coopId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.put(`${API_BASE_URL}/waste_request/${routeRequestId}/coop/${coopId}`, {headers});
  return response.data;
};

export const cancel_route = async (routeId, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.put(`${API_BASE_URL}/route/${routeId}/cancel`, {headers});
  return response.data;
}

export const get_stats_reports = async (reportType, body, access_token) => {
  const headers = {
    Authorization: access_token,
  };
  const response = await axios.post(`${API_BASE_URL}/stats/${reportType}`, body, {headers});
  return response.data;
}
