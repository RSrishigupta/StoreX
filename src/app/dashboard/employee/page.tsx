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
import { useState } from "react";
import AddEmployeeDrawer from "@/Component/emloyeeComponents/addemployee";
import TypeButton from "@/Component/emloyeeComponents/typebutton";
import StatusButton from "@/Component/emloyeeComponents/statusButton"; // Import the new StatusButton
import AssetStatus from "@/Component/emloyeeComponents/assetStatus";

export default function Employee() {
  const [open, setOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

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
            sx={{
              minWidth: 200,
              height: "32px",
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
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            size="small"
            sx={{
              border: "1px dashed rgba(169, 169, 169, 0.5)",
              textTransform: "none",
              padding: "2px 6px",
              minHeight: "32px",
              lineHeight: 1,
              fontSize: "0.75rem",
              color: "black",
            }}
          >
            Asset Status
          </Button>

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
      <Box style={{ overflowY: "auto", maxHeight: "100vh" }} className="px-5 py-5">
        <Typography variant="body2" color="text.secondary">
          (Employee table will be placed here)
        </Typography>
      </Box>

      {/* Add Employee Drawer */}
      <AddEmployeeDrawer open={open} onClose={handleClose} />
    </Box>
  );
}
