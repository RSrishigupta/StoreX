// Employee.tsx
"use client";

import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";


import Link from "next/link";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import AddEmployeeDrawer from "@/Component/emloyeeComponents/addemployee";
import TypeButton from "@/Component/emloyeeComponents/typebutton";
import StatusButton from "@/Component/emloyeeComponents/statusButton"; // Import the new StatusButton
import AssetStatusButton from "@/Component/emloyeeComponents/assetStatus";
import EmployeeData from "@/Component/emloyeeComponents/employeeData";

export default function Employee() {
  const [open, setOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedAssetStatus, setSelectedAssetStatus] = useState<string>("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const breadcrumbs = [
    <Link key="1" href="/dashboard" style={{ fontSize: "0.85rem", color: "gray" }}>
      Dashboard
    </Link>,
    <Typography key="2" sx={{ fontSize: "0.85rem" }}>
      Employee
    </Typography>,
  ];
  //create a reset button along with the asset status button and type button that only show when their is a value selected in the type button and asset status button and status button that clears the selected values
  const handleReset = () => {
    setSelectedTypes([]);
    setSelectedStatus("");
    setSelectedAssetStatus("");
  };

  return (
    <Box>
      {/* Header */}
      <Box className="py-5 px-5 flex justify-between items-center">
        <Stack spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbs}
          </Breadcrumbs>
        </Stack>
      </Box>

      <Divider />

      {/* Top Controls: Search, Filters, Add */}
      <Box
        className="px-5 py-4"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        flexWrap="wrap"
      >
        {/* Left: Search and Filters */}
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap" flex={1}>
          <TextField
            placeholder="Search employee"
            size="small"
            variant="outlined"
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

          {/* type Buttons */}
          <TypeButton selectedTypes={selectedTypes} onTypeSelect={setSelectedTypes} />
          {/* Status Button */}
          <StatusButton selectedStatus={selectedStatus} onStatusSelect={setSelectedStatus} />
          {/* Asset Status Button */}
          <AssetStatusButton selectedAssetStatus={selectedAssetStatus} onAssetStatusSelect={setSelectedAssetStatus} />
          {/* Reset Button */}
          {/* Show reset button only if any filter is selected */}

          {(selectedTypes.length > 0 || selectedStatus || selectedAssetStatus) && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              endIcon={<CloseIcon />}
              onClick={handleReset}
              sx={{
                textTransform: "none",
                fontSize: "0.85rem",
                padding: "6px 12px",
                whiteSpace: "nowrap",
                border: "1px rgba(169, 169, 169, 0.5)",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                },
              }}
            >
              Reset
            </Button>
          )}
        </Box>

        {/* Right: Add Employee */}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#0f172a",
            textTransform: "none",
            fontSize: "0.85rem",
            padding: "6px 12px",
            minHeight: "32px",
            whiteSpace: "nowrap",
          }}
          onClick={handleOpen}
        >
          Add Employee
        </Button>
      </Box>

      {/* Placeholder for employee table */}
      <Box style={{ overflowY: 'auto', maxHeight: '80vh' }}>
      <EmployeeData/>
      </Box>

      {/* Add Employee Drawer */}
      <AddEmployeeDrawer open={open} onClose={handleClose} />
    </Box >
  );
}
