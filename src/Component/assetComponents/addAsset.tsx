'use client';

import {
    Box, Button, Drawer, FormControlLabel, IconButton,
    MenuItem, Radio, RadioGroup, Select, Stack, TextField, Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dayjs } from 'dayjs';
import { addAsset } from '@/API/api';
import AssetSpecificationFields from './AssetSpecificationFields';

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function AddAssetDrawer({ open, onClose }: Props) {
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        brand: '',
        model: '',
        serialNo: '',
        ownership: 'Remotestate',
        assetType: '',
        purchaseDate: null as Dayjs | null,
        warrantyDate: null as Dayjs | null,
        specifications: {
            series: '',
            processor: '',
            ram: '',
            storage: '',
            operatingSystem: '',
            screenResolution: '',
            charger: '',
            phone: '',
            simNo: '',
            osType: '',
            imei1: '',
            imei2: '',
            accessoriesType: '',
            capacity: '',
            remark: ''
        },
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (key: string, value: string | Dayjs | null) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (error) setError(null);
    };

    const mutation = useMutation({
        mutationFn: addAsset,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fetchassets'] });
            alert('Asset added successfully');
            setForm({
                brand: '',
                model: '',
                serialNo: '',
                ownership: 'Remotestate',
                assetType: '',
                purchaseDate: null,
                warrantyDate: null,
                specifications: {
                    series: '',
                    processor: '',
                    ram: '',
                    storage: '',
                    operatingSystem: '',
                    screenResolution: '',
                    charger: '',
                    phone: '',
                    simNo: '',
                    osType: '',
                    imei1: '',
                    imei2: '',
                    accessoriesType: '',
                    capacity: '',
                    remark: ''
                },
            });
            onClose();
        },
        onError: (error) => {
            console.error(error);
            setError('An error occurred while adding the asset.');
        }
    });

    const handleSubmit = () => {
        const { brand, model, serialNo, assetType, ownership, purchaseDate, warrantyDate, specifications } = form;

        if (!brand || !model || !serialNo || !assetType || !purchaseDate || !warrantyDate) {
            setError('All required fields must be filled.');
            return;
        }

        const assetData = {
            brand,
            model,
            serialNo,
            ownedBy: ownership,
            type: assetType,
            purchaseDate: purchaseDate?.toDate() ?? new Date(),
            warrantyDate: warrantyDate?.toDate() ?? new Date(),
            ...(assetType === 'laptop' && {
                series: specifications.series,
                processor: specifications.processor,
                ram: specifications.ram,
                storage: specifications.storage,
                operatingSystem: specifications.operatingSystem,
                screenResolution: specifications.screenResolution,
                charger: specifications.charger,
            }),
            ...(assetType === 'monitor' && {
                screenResolution: specifications.screenResolution,
            }),
            ...(assetType === 'harddrive' && {
                storage: specifications.storage,
            }),
            ...(assetType === 'pendrive' && {
                storage: specifications.storage,

            }),
            ...(assetType === 'mobile' && {
                osType: specifications.osType,
                ram: specifications.ram,
                imei1: specifications.imei1,
                imei2: specifications.imei2,
            }),
            ...(assetType === 'sim' && {
                phone: specifications.phone,
                simNo: specifications.simNo,
            }),
            ...(assetType === 'accessories' && {
                accessoriesType: specifications.accessoriesType,
                capacity: specifications.capacity,
                remark: specifications.remark,
            }),
        };
        console.log("sending from the add aseet", assetData);

        mutation.mutate(assetData);
    };



    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                    },
                },
            }}
        >
            <Box
                sx={{
                    width: 500,
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px 0 0 16px',
                    bgcolor: 'background.paper',
                    boxShadow: 3,
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold" variant="h6">
                        Create New Asset
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box flex={1} overflow="auto">
                    <Stack spacing={1}>
                        <Typography variant="body1">Brand</Typography>
                        <TextField
                            placeholder="Enter Brand"
                            fullWidth
                            size="small"
                            value={form.brand}
                            onChange={(e) => handleChange('brand', e.target.value)}
                            error={!!error && !form.brand}
                        />

                        <Typography variant="body1">Model</Typography>
                        <TextField
                            placeholder="Enter Model"
                            fullWidth
                            size="small"
                            value={form.model}
                            onChange={(e) => handleChange('model', e.target.value)}
                            error={!!error && !form.model}
                        />

                        <Typography variant="body1">Serial Number</Typography>
                        <TextField
                            placeholder="Enter Serial Number"
                            fullWidth
                            size="small"
                            value={form.serialNo}
                            onChange={(e) => handleChange('serialNo', e.target.value)}
                            error={!!error && !form.serialNo}
                        />

                        <Box display="flex" gap={2} flexWrap="wrap" width="100%">
                            <Box flex={1} minWidth={0} maxWidth="240px">
                                <Typography mb={0.5}>Purchase Date</Typography>
                                <DatePicker
                                    value={form.purchaseDate}
                                    onChange={(date) => handleChange('purchaseDate', date)}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                />
                            </Box>
                            <Box flex={1} minWidth={0} maxWidth="240px">
                                <Typography mb={0.5}>Warranty Expiry Date</Typography>
                                <DatePicker
                                    value={form.warrantyDate}
                                    onChange={(date) => handleChange('warrantyDate', date)}
                                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                                />
                            </Box>
                        </Box>

                        <Typography>Ownership</Typography>
                        <RadioGroup
                            row
                            value={form.ownership}
                            onChange={(e) => handleChange('ownership', e.target.value)}
                        >
                            <FormControlLabel value="Remotestate" control={<Radio />} label="Remotestate" />
                            <FormControlLabel value="Client" control={<Radio />} label="Client" />
                        </RadioGroup>

                        <Typography>Asset Type</Typography>
                        <Select
                            fullWidth
                            size="small"
                            value={form.assetType}
                            onChange={(e) => handleChange('assetType', e.target.value)}
                            displayEmpty
                            error={!!error && !form.assetType}
                        >
                            <MenuItem value="">Choose</MenuItem>
                            <MenuItem value="laptop">Laptop</MenuItem>
                            <MenuItem value="mouse">Mouse</MenuItem>
                            <MenuItem value="monitor">Monitor</MenuItem>
                            <MenuItem value="pendrive">Pendrive</MenuItem>
                            <MenuItem value="harddrive">Hard Drive</MenuItem>
                            <MenuItem value="mobile">Mobile</MenuItem>
                            <MenuItem value="sim">Sim</MenuItem>
                            <MenuItem value="accessories">Accessories</MenuItem>
                        </Select>
                    </Stack>
                    <AssetSpecificationFields
                        assetType={form.assetType}
                        form={form}
                        setForm={setForm}
                    />

                </Box>

                {error && <Typography color="error" mt={2}>{error}</Typography>}

                <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                    <Button
                        onClick={handleSubmit}
                        sx={{ backgroundColor: '#64748b', color: 'white', textTransform: 'none' }}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Saving...' : 'Submit'}
                    </Button>
                    <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
