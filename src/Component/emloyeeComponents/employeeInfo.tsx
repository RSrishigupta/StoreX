'use client';
import { Drawer, Box, Typography, IconButton, Divider, Tabs, Tab, Card, CardContent, } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GroupIcon from '@mui/icons-material/Group';

type Employee = {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    type: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    employee: Employee | null;
};

export default function EmployeeInfoDrawer({ open, onClose, employee }: Props) {
    const [tabIndex, setTabIndex] = useState(0);
    if (!employee) return null;

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 400, p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6">{employee.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {employee.email}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Tabs
                    value={tabIndex}
                    onChange={(_, newValue) => setTabIndex(newValue)}
                    variant="fullWidth"
                    sx={{ my: 2 }}
                >
                    <Tab label="Information" />
                    <Tab label="Manage Asset" />
                    <Tab label="Timeline" />
                </Tabs>

                <Divider />

                {tabIndex === 0 && (
                    <Card sx={{ mt: 2, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <PersonOutlineIcon />
                                <Typography>
                                    <strong>Name:</strong> {employee.name}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <EmailIcon />
                                <Typography>
                                    <strong>Email:</strong> {employee.email}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <PhoneIcon />
                                <Typography>
                                    <strong>Phone No.:</strong> {employee.phone}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <CheckCircleOutlineIcon />
                                <Typography>
                                    <strong>Status:</strong> {employee.status}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" gap={1}>
                                <GroupIcon />
                                <Typography>
                                    <strong>Type:</strong> {employee.type}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                )}

                {tabIndex === 1 && (
                    <Typography variant="body2" color="text.secondary" mt={2}>
                        Manage Asset tab content goes here...
                    </Typography>
                )}

                {tabIndex === 2 && (
                    <Typography variant="body2" color="text.secondary" mt={2}>
                        Timeline tab content goes here...
                    </Typography>
                )}
            </Box>
        </Drawer>
    );
}
