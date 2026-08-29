import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Set authentication headers
export const setAuthHeaders = (user) => {
  if (user) {
    api.defaults.headers.common['X-User-Id'] = String(user.id);
    api.defaults.headers.common['X-User-Role'] = user.role || 'USER';
  } else {
    delete api.defaults.headers.common['X-User-Id'];
    delete api.defaults.headers.common['X-User-Role'];
  }
};

// ==================== RIDES ====================

export const searchRides = async (params = {}) => {
  const response = await api.get('/rides/search/', {
    params: {
      origin: params.origin || '',
      destination: params.destination || '',
      date: params.date || '',
      seats: params.seats || 1,
    },
  });

  return response.data;
};

export const getRideDetail = async (rideId) => {
  const response = await api.get(`/rides/${rideId}/`);
  return response.data;
};

export const publishRideAdvanced = async (rideData) => {
  const response = await api.post('/rides/publish-advanced/', rideData);
  return response.data;
};

export const requestRide = async (rideId, requestData) => {
  const response = await api.post(
    `/rides/${rideId}/request/`,
    requestData
  );
  return response.data;
};

// ==================== AUTH ====================

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login/', credentials);

  if (response.data?.user) {
    setAuthHeaders(response.data.user);
  }

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register/', userData);

  if (response.data?.user) {
    setAuthHeaders(response.data.user);
  }

  return response.data;
};

export const googleAuth = async (googlePayload) => {
  const response = await api.post('/auth/google/', googlePayload);

  if (response.data?.user) {
    setAuthHeaders(response.data.user);
  }

  return response.data;
};

// ==================== NOTIFICATIONS ====================

export const getNotifications = async (userId) => {
  const response = await api.get('/notifications/', {
    params: {
      user_id: userId,
    },
  });

  return response.data;
};

// ==================== DRIVER ====================

export const verifyDriverDocs = async (docData) => {
  const response = await api.post('/driver/verify-docs/', docData);
  return response.data;
};

export const getDriverRequests = async () => {
  const response = await api.get('/driver/requests/');
  return response.data;
};

export const handleRequestAction = async (requestId, action) => {
  const response = await api.post(
    `/requests/${requestId}/action/`,
    { action }
  );

  return response.data;
};

// ==================== TRACKING ====================

export const postDeviceLocation = async (
  rideId,
  latitude,
  longitude,
  status
) => {
  const response = await api.post(
    `/rides/${rideId}/location/`,
    {
      latitude,
      longitude,
      status,
    }
  );

  return response.data;
};

export const getProtectedRideTracking = async (rideId) => {
  const response = await api.get(
    `/rides/${rideId}/tracking/`
  );

  return response.data;
};

// ==================== ADMIN ====================

export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard/');
  return response.data;
};

// ==================== SEED ====================

export const seedDatabase = async () => {
  const response = await api.post('/seed/');
  return response.data;
};