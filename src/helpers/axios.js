import axios from 'axios';



const apiClient = axios.create({
  baseURL:`http://localhost:4004`,  
  timeout: 10000, })


apiClient.interceptors.request.use(
  (config) => {
  
    const token = localStorage.getItem('token');  
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  (response) => {
   
    console.log('Response:', response);
    return response;
  },
  (error) => {
 
    if (error.response && error.response.status === 401) {
   
      console.error('Unauthorized access - redirect to login');
  
    }
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);


const callApi = async (url, method = 'GET', data = null, config = {}) => {
  try {
    const response = await apiClient({
      url,
      method,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export default callApi;
