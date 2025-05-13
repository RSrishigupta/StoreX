'use client';
import { Breadcrumbs, Button, Stack, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Divider, } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useState } from 'react';
import AddAdminModal from '@/Component/authorized/AddAdmin';
import { fetchAdmins } from '@/API/api';
import DeleteAdminButton from './DeleteAdmin';
const AdminPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
  });
  const [open, setOpen] = useState(false);
  if (isLoading) return <Typography>Loading admins...</Typography>;
  if (isError) return <Typography>Failed to load admins.</Typography>;
  const breadcrumbs = [
    <Link key="1" href="/dashboard" style={{ fontSize: '0.85rem', color: 'gray' }}>
      Dashboard
    </Link>,
    <Link key="2" href="/dashboard/#" style={{ fontSize: '0.85rem', color: 'gray' }}>
      Setting
    </Link>,
    <Typography key="3" sx={{ fontSize: '0.85rem' }}>
      Authorized List
    </Typography>,
  ];
  return (
    <div >
      <div className="py-4 px-4">
        <Stack spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </div>
      <Divider />
      <Box className="px-4 py-4" style={{ overflowY: 'auto', maxHeight: '100vh' }} >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Authorized List
        </Typography>

        <Button
          variant="contained"
          sx={{
            backgroundColor: '#0f172a',
            '&:hover': { backgroundColor: 'green' },
            marginBottom: 2, // Added gutter bottom
          }}
          onClick={() => setOpen(true)}
        >
          <Box display="flex" gap={1} alignItems="center">
            <AddCircleOutlineOutlinedIcon />
            <Typography>ADD</Typography>
          </Box>
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ py: 1 }}>Email</TableCell>
                <TableCell sx={{ py: 1 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((admin: { id: string; email: string }) => (
                <TableRow key={admin.id}>
                  <TableCell sx={{ py: 1 }}>{admin.email}</TableCell>
                  <TableCell sx={{ py: 1 }}>
                    <DeleteAdminButton id={admin.id} email={admin.email} onSuccess={refetch} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography sx={{ mt: 2 }}>
          Total Users: {data?.length}
        </Typography>

        <AddAdminModal open={open} onClose={() => setOpen(false)} onSuccess={refetch} />
      </Box>
    </div>
  );
};

export default AdminPage;
