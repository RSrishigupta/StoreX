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
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';


import Link from "next/link";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";
import AddEmployeeDrawer from "@/Component/emloyeeComponents/addemployee";
import TypeButton from "@/Component/emloyeeComponents/typebutton";
import StatusButton from "@/Component/emloyeeComponents/statusButton";
import AssetStatusButton from "@/Component/emloyeeComponents/assetStatus";
import EmployeeData from "@/Component/emloyeeComponents/employeeData";

export default function Employee() {
  const [open, setOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedAssetStatus, setSelectedAssetStatus] = useState<string>("");
  // console.log("Selected Types:", selectedTypes);
  // console.log("Selected Status:", selectedStatus);
  // console.log("Selected Asset Status:", selectedAssetStatus);
  const [searchQuery, setSearchQuery] = useState('');


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
            placeholder="Search employee"
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
          <AssetStatusButton selectedAssetStatus={selectedAssetStatus} onAssetStatusSelect={setSelectedAssetStatus} />

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


        <Button
          variant="contained"
          startIcon={<AddCircleOutlineOutlinedIcon />}
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

      <Box style={{ overflowY: 'auto', maxHeight: '80vh' }}>
        <EmployeeData
          selectedTypes={selectedTypes}
          selectedStatus={selectedStatus}
          selectedAssetStatus={selectedAssetStatus}
          searchQuery={searchQuery}
        />

      </Box>

      <AddEmployeeDrawer open={open} onClose={handleClose} />
    </Box >
  );
}


