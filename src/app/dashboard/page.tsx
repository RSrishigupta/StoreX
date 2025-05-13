'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/API/api';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardCard from '@/Component/DashboardCard/card';
import { Box, Breadcrumbs, Card, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, } from '@mui/material';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'total';
  
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardData', status],
    queryFn: () => fetchDashboardData(status),
  });
  // if (!session.user) return <div>Not authenticated</div>

  const handleCardClick = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', newStatus);
    router.push(`?${params.toString()}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading dashboard data</div>;
  const breadcrumbs = [
    <Link key="1" color="inherit" href="/dashboard" style={{ fontSize: '0.85rem', color: 'gray' }}>Dashboard</Link>,
  ];
  const assetData = data?.AssetData ?? {};

  return (
    <>
      <Stack spacing={2} px={2} py={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
      <Divider />

      <Box px={6} py={4}>
        <Typography variant="h5" fontWeight={900}>
          Dashboard
        </Typography>

        {/* Cards Row */}
        <Box
          display="flex"
          width="100%"
          gap={3}
          py={2}
        >
          <Box flex={1} onClick={() => handleCardClick('total')}>
            <DashboardCard
              count={data.Total}
              title="Total Assets"
              description="All assets in the company"
              selected={status === 'total'}
            />
          </Box>
          <Box flex={1} onClick={() => handleCardClick('available')}>
            <DashboardCard
              count={data.TotalAvailable}
              title="Available Assets"
              description="Assets which are ready to be assigned"
              selected={status === 'available'}
            />
          </Box>
          <Box flex={1} onClick={() => handleCardClick('assign')}>
            <DashboardCard
              count={data.TotalAssigned}
              title="Assigned Assets"
              description="Assets which are assigned to employees"
              selected={status === 'assign'}
            />
          </Box>
        </Box>

        {/* Table */}
        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
          <TableContainer component={Paper} elevation={0} sx={{ width: '90%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, p: 1 }}>Asset Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, p: 1 }}>Asset Quantity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(assetData).map(([type, count]) => (
                  <TableRow key={type}>
                    <TableCell sx={{ p: 1 }}>{type}</TableCell>
                    <TableCell sx={{ p: 1 }}>{count as number}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </>
  );
};

// export default DashboardPage;
