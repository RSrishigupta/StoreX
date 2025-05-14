'use client';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import InfoOutlineTwoToneIcon from '@mui/icons-material/InfoOutlineTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from '@/API/api';

type Asset = {
  id: string;
  type: string;
  brand: string;
  model: string;
  serial_no: string;
  purchase_date: string | null;
  status: string;
};

export default function AssetData({ selectedTypes, searchQuery, selectedStatus }: { selectedTypes: string[]; selectedStatus: string; searchQuery: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['fetchassets'],
    queryFn: fetchAssets,
  });
  // console.log(data);


  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error: {(error as Error).message}</Typography>;

  return (
    <Box px={2.5} sx={{ overflowY: 'auto', maxHeight: '80vh' }}>
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ color: 'gray' }}>Brand</TableCell>
              <TableCell sx={{ color: 'gray' }}>Model</TableCell>
              <TableCell sx={{ color: 'gray' }}>Serial No.</TableCell>
              <TableCell sx={{ color: 'gray' }}>Asset Type</TableCell>
              <TableCell sx={{ color: 'gray' }}>Status</TableCell>
              <TableCell sx={{ color: 'gray' }}>Purchased Date</TableCell>
              <TableCell sx={{ color: 'gray' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.filter((asset: Asset) => {

              const typeMatch =
                selectedTypes.length === 0 || selectedTypes.includes(asset.type);

              const statusMatch =
                !selectedStatus ||
                asset.status.toLowerCase() === selectedStatus.toLowerCase();
              const query = searchQuery.toLowerCase();
              const matchesSearch =
                asset.brand.toLowerCase().includes(query) ||
                (asset.model?.toLowerCase() ?? "").includes(query) ||
                (asset.serial_no?.toLowerCase() ?? "").includes(query) ||
                asset.type.toLowerCase().includes(query) ||
                asset.status.toLowerCase().includes(query);
              return typeMatch && statusMatch && matchesSearch;
            })
              .map((asset: Asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.brand || 'None'}</TableCell>
                  <TableCell>{asset.model || 'None'}</TableCell>
                  <TableCell>{asset.serial_no || 'None'}</TableCell>
                  <TableCell>{asset.type || 'None'}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color:
                          asset.status === 'Assign'
                            ? '#4d9aff'
                            : asset.status === 'Available'
                              ? '#27ae60'
                              : asset.status === 'Service'
                                ? '#f5a623'
                                : 'red',
                      }}
                    >
                      {asset.status}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(asset.purchase_date)}</TableCell>
                  <TableCell>
                    <IconButton>
                      <EditTwoToneIcon fontSize="small" />
                    </IconButton>
                    <IconButton>
                      <InfoOutlineTwoToneIcon fontSize="small" />
                    </IconButton>
                    <IconButton>
                      <MoreVertTwoToneIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}


function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return 'None';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'None';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
