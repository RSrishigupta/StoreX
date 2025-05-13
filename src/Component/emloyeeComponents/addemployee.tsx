"use client";

import {  Box,  Button,  Drawer, FormControlLabel, IconButton,  Radio,  RadioGroup,  Stack,  TextField,  Typography,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { addEmployee } from "@/API/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type AddEmployeeDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddEmployeeDrawer({ open, onClose }: AddEmployeeDrawerProps) {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "employee",
    status: "active",
  });

  const [error, setError] = useState<string | null>(null);  // General error handling

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null); // Clear error on change
  };

  const mutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchemployees"] });
      setError(null); 
      setForm({ name: "", email: "", phone: "", type: "employee", status: "active" });
      alert("Employee added successfully");
      onClose();
    },
    onError: (error: Error) => {
      const apiError = error as { response?: { status: number } };
      if (apiError.response?.status === 409) {
        setError("Email already exists. Please use a different one.");
      } else {
        setError("Failed to add employee. Please try again.");
      }
    },
  });

  const handleSubmit = () => {
    const { name, email, phone } = form;
    if (!name || !email || !phone) {
      setError("All fields are required.");
      return;
    }
    mutation.mutate(form);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        },
      }}
    >
      <Box
        sx={{
          width: 500,
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px 0 0 16px",
          bgcolor: "background.paper",
          boxShadow: 3,
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
            <TextField
              placeholder="Enter Name"
              required
              size="small"
              fullWidth
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={!!error && !form.name}
              helperText={error && !form.name ? "Name is required" : ""}
            />

            <Typography variant="body1">Email</Typography>
            <TextField
              placeholder="Enter Email"
              required
              size="small"
              fullWidth
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={!!error && !form.email}
              helperText={error && !form.email ? "Email is required" : ""}
            />

            <Typography variant="body1">Phone No.</Typography>
            <TextField
              placeholder="Enter Phone No"
              required
              size="small"
              fullWidth
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={!!error && !form.phone}
              helperText={error && !form.phone ? "Phone number is required" : ""}
            />

            <Typography fontWeight={500}>Employee Type</Typography>
            <RadioGroup
              row
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
            >
              <FormControlLabel value="employee" control={<Radio />} label="Employee" />
              <FormControlLabel value="intern" control={<Radio />} label="Intern" />
              <FormControlLabel value="freelancer" control={<Radio />} label="Freelancer" />
            </RadioGroup>

            <Typography fontWeight={500}>Employee Status</Typography>
            <RadioGroup
              row
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <FormControlLabel value="active" control={<Radio />} label="Active" />
              <FormControlLabel value="Not an employee" control={<Radio />} label="Not An Employee" />
            </RadioGroup>
          </Stack>
        </Box>

        {error && <Typography color="error" mt={2}>{error}</Typography>}

        <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
          <Button
            onClick={handleSubmit}
            sx={{ backgroundColor: "#64748b", color: "white", textTransform: "none" }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
          <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none" }}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
