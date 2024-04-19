
import axios from "axios";

export const API_URL =
  "https://650bf18d47af3fd22f66c04e.mockapi.io/apitask/";

export const fetchEmployeeData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const response = await axios.post(API_URL, employeeData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// export const fetchEmployeeById = async (id) => {
//   try {
//     const response = await axios.get(API_URL + id);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

export const updateEmployee = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response;
  } catch (error) {
    throw error;
  }
};



export const deleteEmployee = async (employeeId) => {
  try {
    const response = await axios.delete(`${API_URL}/${employeeId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// export const deleteEmployee = async (employeeId) => {
//   try {
//     const response = await axios.delete(API_URL + '/' + employeeId);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };