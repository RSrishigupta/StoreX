export async function fetchAdmins() {
    try {
      const response = await fetch('http://localhost:3000/api/admin'); // Adjust the API route if necessary
      if (!response.ok) throw new Error('Failed to fetch admin data');
      const data = await response.json();
      return data.ADMIN; // Return the admin array
    } catch (err) {
      console.error('Error fetching admin data:', err);
      return [];
    }
  }
