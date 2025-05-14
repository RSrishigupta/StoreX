'use client';

import { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import InfoOutlineTwoToneIcon from '@mui/icons-material/InfoOutlineTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchemployees, deleteEmployee } from '@/API/api';
import AddEmployeeDrawer from '@/Component/emloyeeComponents/addemployee';
import EmployeeInfoDrawer from '@/Component/emloyeeComponents/employeeInfo';

// Type definitions

type AssignedAsset = {
  assignedAssetId: string;
  assetId: string;
  assignedDate: string;
  retriveDate: string | null;
  retriveReason: string | null;
  type: string;
  brand: string;
  model: string;
  serialNo: string;
  purchaseDate: string;
  warrantyExpiry: string;
  owner: string;
  archiveReason: string | null;
  assignedAssetCount: number;
};

type Employee = {
  assignedAssetCount: number;
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  type: string;
  assignedAssets: AssignedAsset[];
};

export default function EmployeeData({ selectedTypes, selectedStatus, selectedAssetStatus, searchQuery }: { selectedTypes: string[]; selectedStatus: string; searchQuery: string; selectedAssetStatus: string }) {
  // console.log("data in the empolyeedata----------------->");
  // console.log("Selected Types:", selectedTypes);
  // console.log("Selected Status:", selectedStatus);
  // console.log("Selected Asset Status:", selectedAssetStatus);


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['fetchemployees'],
    queryFn: fetchemployees,
  });

  const queryClient = useQueryClient();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [openInfoDrawer, setOpenInfoDrawer] = useState(false);
  const [infoEmployee, setInfoEmployee] = useState<Employee | null>(null);

  const [selectedEmployeeToDelete, setSelectedEmployeeToDelete] = useState<Employee | null>(null);
  const [deleteReason, setDeleteReason] = useState('');


  const mutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchemployees'] });
      setSelectedEmployeeToDelete(null);
      setDeleteReason('');
    },
  });

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedEmployee(null);
  };

  const handleInfoClick = (employee: Employee) => {
    setInfoEmployee(employee);
    setOpenInfoDrawer(true);
  };

  const handleCloseInfoDrawer = () => {
    setOpenInfoDrawer(false);
    setInfoEmployee(null);
  };

  const handleConfirmDelete = () => {
    if (selectedEmployeeToDelete && deleteReason.trim()) {
      mutation.mutate({ id: selectedEmployeeToDelete.id, reason: deleteReason });
    }
  };

  const handleCancelDelete = () => {
    setSelectedEmployeeToDelete(null);
    setDeleteReason('');
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error: {(error as Error).message}</Typography>;

  return (
    <Box px={2.5}>
      <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ color: 'gray' }}>Name</TableCell>
              <TableCell sx={{ color: 'gray' }}>Email</TableCell>
              <TableCell sx={{ color: 'gray' }}>Phone No.</TableCell>
              <TableCell sx={{ color: 'gray' }}>Status</TableCell>
              <TableCell sx={{ color: 'gray' }}>Type</TableCell>
              <TableCell sx={{ color: 'gray' }}>Asset Status</TableCell>
              <TableCell sx={{ color: 'gray' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .filter((emp: Employee) => {
                const typeMatch =
                  selectedTypes.length === 0 || selectedTypes.includes(emp.type);

                const statusMatch =
                  !selectedStatus ||
                  emp.status.toLowerCase() === selectedStatus.toLowerCase();

                const assetStatusMatch =
                  !selectedAssetStatus ||
                  (selectedAssetStatus === 'Assigned' && emp.assignedAssetCount > 0) ||
                  (selectedAssetStatus === 'Unassigned' && emp.assignedAssetCount === 0);

                const query = searchQuery.toLowerCase();
                const matchesSearch =
                  emp.name.toLowerCase().includes(query) ||
                  emp.email.toLowerCase().includes(query) ||
                  emp.phone.includes(query) ||
                  emp.status.toLowerCase().includes(query) ||
                  emp.type.toLowerCase().includes(query) ||
                  (emp.assignedAssetCount > 0 && 'assigned'.includes(query)) ||
                  (emp.assignedAssetCount === 0 && 'unassigned'.includes(query));

                return typeMatch && statusMatch && assetStatusMatch && matchesSearch;
              })

              .map((emp: Employee) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color:
                          emp.status === 'Active'
                            ? 'green'
                            : emp.status === 'Deleted'
                              ? 'red'
                              : 'black',
                      }}
                    >
                      {emp.status}
                    </Typography>
                  </TableCell>
                  <TableCell>{emp.type}</TableCell>
                  <TableCell>
                    {emp.assignedAssetCount === 0 ? 'Unassigned' : `Assigned (${emp.assignedAssetCount})`}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditClick(emp)}>
                      <EditTwoToneIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleInfoClick(emp)}>
                      <InfoOutlineTwoToneIcon fontSize="small" />
                    </IconButton>
                    {emp.assignedAssetCount === 0 && (
                      <IconButton onClick={() => setSelectedEmployeeToDelete(emp)}>
                        <MoreVertTwoToneIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>


        </Table>
      </TableContainer>

      {/* Edit daata */}
      <AddEmployeeDrawer
        open={openDrawer}
        onClose={handleCloseDrawer}
        employee={selectedEmployee}
      />

      <EmployeeInfoDrawer
        open={openInfoDrawer}
        onClose={handleCloseInfoDrawer}
        employee={infoEmployee}
      />
      {/*delete logic here */}
      <Dialog open={!!selectedEmployeeToDelete} onClose={handleCancelDelete}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to archive{' '}
            <strong>{selectedEmployeeToDelete?.name}</strong>? Please provide a reason.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Deleting"
            type="text"
            fullWidth
            required
            multiline
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={!deleteReason.trim()}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
