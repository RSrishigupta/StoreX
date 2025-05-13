"use client";

import {
  Box,
  Button,
  Drawer,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type AddEmployeeDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddEmployeeDrawer({ open, onClose }: AddEmployeeDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        },
      }}>
      <Box
        sx={{
          width: 500,
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px 0 0 16px", // Rounded left edges
          bgcolor: "background.paper", // Ensure background color is set
          boxShadow: 3, // Optional: adds elevation effect
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight="bold" variant="h6">
            Create New Employee
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box flex={1} overflow="auto">
          <Stack spacing={2}>
            <Typography variant="body1">Name</Typography>
            <TextField placeholder="Enter Name" size="small" fullWidth />

            <Typography variant="body1">Email</Typography>
            <TextField placeholder="Enter Email" size="small" fullWidth />

            <Typography variant="body1">Phone No.</Typography>
            <TextField placeholder="Enter Phone No" size="small" fullWidth />

            <Typography fontWeight={500}>Employee Type</Typography>
            <RadioGroup row defaultValue="Employee">
              <FormControlLabel value="Employee" control={<Radio />} label="Employee" />
              <FormControlLabel value="Intern" control={<Radio />} label="Intern" />
              <FormControlLabel value="Freelancer" control={<Radio />} label="Freelancer" />
            </RadioGroup>

            <Typography fontWeight={500}>Employee Status</Typography>
            <RadioGroup row defaultValue="Active">
              <FormControlLabel value="Active" control={<Radio />} label="Active" />
              <FormControlLabel value="Not" control={<Radio />} label="Not An Employee" />
            </RadioGroup>
          </Stack>
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
          <Button
            onClick={onClose}
            sx={{ backgroundColor: "#64748b", color: "white", textTransform: "none" }}
          >
            Save
          </Button>
          <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none" }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
