'use client';
import { Card, CardContent, Table } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
const fetchDashboardData = async () => {
  const response = await axios.get('http://localhost:3000/api/dashboard?status=assign');
  return response.data;
};
const DashboardPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading dashboard data</div>;
  const total = data?.Total ?? 0;
  const assetData = data?.AssetData ?? {};
  return (
    <div className="p-6">
      <Card className="mb-4">
        <CardContent>
          <h2 className="text-xl font-bold">Total Assets: {total}</h2>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Assets by Type</h3>
          <Table>
            <thead>
              <tr>
                <th className="border px-4 py-2">Asset Type</th>
                <th className="border px-4 py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(assetData).map(([type, count]) => (
                <tr key={type}>
                  <td className="border px-4 py-2 capitalize">{type}</td>
                  <td className="border px-4 py-2">{count as number}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
export default DashboardPage;
