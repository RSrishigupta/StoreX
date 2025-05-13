import axios from 'axios';
const baseURL = 'http://localhost:3000/api'

export async function fetchAdmins() {
  try {
    const response = await axios.get(`${baseURL}/admin`);
    return response.data.users;
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw new Error('Failed to fetch admin data');
  }
}



export const fetchDashboardData = async (status: string) => {
  const response = await axios.get(`${baseURL}/dashboard?status=${status}`);
  return response.data;
};


export const addAdmin = async (email: string) => {
  const response = await axios.post(`${baseURL}/admin`, { email });
  return response.data;
};

export const deleteAdmin = async (id: string) => {
  const res = await axios.delete(`${baseURL}/admin/${id}`);
  return res.data;
};