// AssetStatusButton.tsx
"use client";

import {
  Button,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
  FormControl,
  Input,
  InputAdornment,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { ArrowDropDown } from "@mui/icons-material";

interface AssetStatusButtonProps {
  selectedAssetStatus: string[];
  onAssetStatusSelect: (status: string[]) => void;
}

const allAssetStatuses = ["Assigned", "Unassigned"];

const AssetStatusButton: React.FC<AssetStatusButtonProps> = ({
  selectedAssetStatus,
  onAssetStatusSelect,
}) => {
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
    const updated = selectedAssetStatus.includes(status)
      ? selectedAssetStatus.filter((s) => s !== status)
      : [...selectedAssetStatus, status];
    onAssetStatusSelect(updated); // Update the selected status
  };

  const filteredStatuses = allAssetStatuses.filter((status) =>
    status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={handleClick}
        startIcon={<ArrowDropDown />}
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
        {selectedAssetStatus.length > 0 ? selectedAssetStatus.join(", ") : "Asset Status"}
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
          <FormControl variant="standard" sx={{ width: 160 }}>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search status"
              disableUnderline
              startAdornment={
                <InputAdornment position="start">
                  <ArrowDropDown fontSize="small" />
                </InputAdornment>
              }
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                padding: "4px 8px",
                fontSize: "0.8rem",
              }}
            />
          </FormControl>
        </Box>
        <Divider />

        {/* Status List */}
        {filteredStatuses.map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleCheckboxChange(status)}
            dense
            sx={{ fontSize: "0.75rem" }}
          >
            <Checkbox
              checked={selectedAssetStatus.includes(status)}
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

export default AssetStatusButton;
