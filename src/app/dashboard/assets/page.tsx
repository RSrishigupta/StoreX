'use client';

import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';
import TypeButton from '@/Component/assetComponents/Typebutton';
import StatusButton from '@/Component/assetComponents/status';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AssetData from '@/Component/assetComponents/assetData';
import AddAssetModal from '@/Component/assetComponents/addAsset';

export default function Asset() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleReset = () => {

    setSelectedTypes([]);
    setSelectedStatus('');
  };

  const breadcrumbs = [
    <Link key="1" href="/dashboard" style={{ fontSize: '0.85rem', color: 'gray' }}>
      Dashboard
    </Link>,
    <Typography key="2" sx={{ fontSize: '0.85rem' }}>
      Assets
    </Typography>,
  ];

  return (
    <div>
      <Box className="py-5 px-5 flex justify-between items-center">
        <Stack spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Box>
      <Divider />

      <Box
        className="px-5 py-4"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        flexWrap="wrap"
      >
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" flex={1}>
          <TextField
            placeholder="Search Asset"
            size="small"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: 400,
              height: "36px",
              "& .MuiInputBase-root": {
                height: "100%",
                fontSize: "0.85rem",
              },
              "& .MuiInputBase-input": {
                padding: "6px 10px",
              },
            }}
          />
          <TypeButton selectedTypes={selectedTypes} onTypeSelect={setSelectedTypes} />
          <StatusButton selectedStatus={selectedStatus} onStatusSelect={setSelectedStatus} />
          {(selectedTypes.length > 0 || selectedStatus) && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              endIcon={<CloseIcon />}
              onClick={handleReset}
              sx={{
                textTransform: 'none',
                fontSize: '0.85rem',
                padding: '6px 12px',
                whiteSpace: 'nowrap',
              }}
            >
              Reset
            </Button>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={<AddCircleOutlineOutlinedIcon />}
          sx={{
            backgroundColor: '#0f172a',
            textTransform: 'none',
            fontSize: '0.85rem',
            padding: '6px 12px',
            minHeight: '32px',
            whiteSpace: 'nowrap',
          }}
          onClick={() => setOpenModal(true)}
        >
          Add Asset
        </Button>
      </Box>

      {/* <AssetData /> */}
      <AssetData
        selectedTypes={selectedTypes}
        selectedStatus={selectedStatus}
        searchQuery={searchQuery}

      />

      <AddAssetModal open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
}
