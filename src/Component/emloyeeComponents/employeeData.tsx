'use client';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import InfoOutlineTwoToneIcon from '@mui/icons-material/InfoOutlineTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';
import { useQuery } from '@tanstack/react-query';
import { fetchemployees } from '@/API/api';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Typography,
    Box
} from '@mui/material';

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

export default function EmployeeData() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['fetchemployees'],
        queryFn: fetchemployees,
    });
    console.log(data);


    if (isLoading) return <Typography>Loading...</Typography>;
    if (isError) return <Typography>Error: {(error as Error).message}</Typography>;

    return (
        <Box px={2.5}>
            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
                <Table size='small'>
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
                        {data.map((emp: Employee) => (
                            <TableRow key={emp.id}>
                                <TableCell>{emp.name}</TableCell>
                                <TableCell>{emp.email}</TableCell>
                                <TableCell>{emp.phone}</TableCell>
                                <TableCell>
                                    <Typography sx={{
                                        color: emp.status === 'active'
                                            ? 'green'
                                            : emp.status === 'deleted'
                                                ? 'red'
                                                : 'black'
                                    }}>{emp.status}</Typography>
                                </TableCell>
                                <TableCell>{emp.type}</TableCell>
                                <TableCell>
                                    Assigned ({emp.assignedAssetCount ?? 0})
                                </TableCell>
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
