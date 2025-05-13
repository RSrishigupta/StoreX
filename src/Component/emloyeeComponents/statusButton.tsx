"use client";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
  Input,
  InputAdornment,
  Divider,
} from "@mui/material";
import { useState } from "react";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

interface StatusButtonProps {
  selectedStatus: string;
  onStatusSelect: (status: string) => void;
}

const allStatuses = ["Active", "Deleted", "Not an Employee"];

const StatusButton: React.FC<StatusButtonProps> = ({ selectedStatus, onStatusSelect }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState("");

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSearch(""); // Reset search
  };

  const handleCheckboxChange = (status: string) => {
    onStatusSelect(status); // Update the selected status
    // setAnchorEl(null); // Close the menu after selection
  };

  const filteredStatuses = allStatuses.filter((status) =>
    status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleClick}
        startIcon={<AddCircleOutlineOutlinedIcon />}
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
        {selectedStatus || "Status"}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {/* Custom Styled Search Box */}
        <Box display="flex" justifyContent="center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search status"
            disableUnderline
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            }
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              padding: "4px 8px",
              fontSize: "0.8rem",
            }}
          />
        </Box>
        <Divider />

        {/* Status List with Checkbox */}
        {filteredStatuses.map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleCheckboxChange(status)}
            dense
            sx={{ fontSize: "0.75rem" }}
          >
            <Checkbox
              checked={selectedStatus === status}
              size="small"
              sx={{ padding: 0.5, marginRight: 1 }}
            />
            <ListItemText primary={status} />
          </MenuItem>
        ))}

        {filteredStatuses.length === 0 && (
          <MenuItem disabled sx={{ fontSize: "0.75rem", opacity: 0.6 }}>
            No results
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default StatusButton;
