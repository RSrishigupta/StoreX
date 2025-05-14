import axios from 'axios';
const baseURL = 'http://localhost:3000/api'

export const fetchDashboardData = async (status: string) => {
  const response = await axios.get(`${baseURL}/dashboard?status=${status}`);
  return response.data;
};
//////////////////admin/////////////////////

export async function fetchAdmins() {
  try {
    const response = await axios.get(`${baseURL}/admin`);
    return response.data.users;
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw new Error('Failed to fetch admin data');
  }
}

export const addAdmin = async (email: string) => {
  const response = await axios.post(`${baseURL}/admin`, { email });
  return response.data;
};

export const deleteAdmin = async (id: string) => {
  const res = await axios.delete(`${baseURL}/admin/${id}`);
  return res.data;
};
/////////////////////////emplpoyeee///////////////////////
export async function fetchemployees() {
  try {
    const response = await axios.get(`${baseURL}/employee`);
    return response.data.employees;
  } catch (error) {
    console.error('Error fetching employee data:', error);
    throw new Error('Failed to fetch employee data');
  }
}

export type EmployeeFormData = {
  name: string;
  email: string;
  phone: string;
  type: string;
  status: string;
};

export async function addEmployee(data: EmployeeFormData) {
  const response = await axios.post(`${baseURL}/employee`, data);
  return response.data.employee;
}

export async function updateEmployee(id: string, data: EmployeeFormData) {
  const res = await fetch(`/api/employee/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update employee');
  }

  return res.json();
}

export const deleteEmployee = async ({ id, reason }: { id: string; reason: string }) => {
  const res = await axios.delete(`${baseURL}/employee/${id}`, {
    data: { reason },
  });
  return res.data;
};
/////////////////////////asset///////////////////////
export async function fetchAssets() {
  try {
    const response = await axios.get(`${baseURL}/assetData`);
    return response.data.assets;
  } catch (error) {
    console.error('Error fetching asset data:', error);
    throw new Error('Failed to fetch asset data');
  }
}
export type AssetFormData = {
  brand: string;
  model: string;
  serialNo: string;
  ownedBy: string;
  type: string;
  purchaseDate: Date;
  warrantyDate: Date;
};
export const addAsset = async (data: AssetFormData) => {
  console.log('data in the api call ', data);
  
  const response = await axios.post(`${baseURL}/assetData`, data);
  return response.data;
};
